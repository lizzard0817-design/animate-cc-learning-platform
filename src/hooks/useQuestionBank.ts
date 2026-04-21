import { useState, useCallback } from 'react'
import type { Question, QuestionStats } from '@/types'
import { DEFAULT_QUESTIONS } from '@/data/defaultQuestions'
import { LEVEL_CONFIG } from '@/data/levelConfig'

export function useQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [filterLevel, setFilterLevel] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredQuestions = questions.filter(q => {
    const matchLevel = filterLevel === 0 || q.level_id === filterLevel
    const matchSearch = searchQuery === '' || q.content.includes(searchQuery)
    return matchLevel && matchSearch
  })

  const stats: QuestionStats = {
    total: questions.length,
    level_count: LEVEL_CONFIG.length,
    by_level: LEVEL_CONFIG.reduce((acc, level) => {
      acc[level.id] = questions.filter(q => q.level_id === level.id).length
      return acc
    }, {} as Record<number, number>),
    ai_generated_count: questions.filter(q => q.is_ai_generated).length,
  }

  const addQuestion = useCallback((question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => {
    const newQuestion: Question = {
      ...question,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setQuestions(prev => [...prev, newQuestion])
  }, [])

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q)
    )
    setEditingQuestion(null)
  }, [])

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }, [])

  const resetBank = useCallback(() => {
    setQuestions(DEFAULT_QUESTIONS)
  }, [])

  return {
    questions: filteredQuestions,
    allQuestions: questions,
    stats,
    editingQuestion,
    filterLevel,
    setFilterLevel,
    searchQuery,
    setSearchQuery,
    setEditingQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetBank,
  }
}
