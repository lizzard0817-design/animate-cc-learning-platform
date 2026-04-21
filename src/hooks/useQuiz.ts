import { useState, useCallback } from 'react'
import type { Question, AnswerDetail, LearningAdvice, QuizResult, Grade } from '@/types'
import { getQuestionsByLevel, getQuestionById } from '@/data/defaultQuestions'

export function useQuiz() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [isQuizActive, setIsQuizActive] = useState(false)

  const startQuiz = useCallback((levelId: number) => {
    const levelQuestions = getQuestionsByLevel(levelId)
    setQuestions(levelQuestions)
    setCurrentLevel(levelId)
    setCurrentIndex(0)
    setAnswers(new Map())
    setCurrentAnswer('')
    setShowFeedback(false)
    setStartTime(Date.now())
    setIsQuizActive(true)
  }, [])

  const submitAnswer = useCallback(() => {
    if (!currentAnswer || !questions[currentIndex]) return

    const question = questions[currentIndex]
    const newAnswers = new Map(answers)
    newAnswers.set(question.id, currentAnswer)
    setAnswers(newAnswers)
    setShowFeedback(true)
  }, [currentAnswer, questions, currentIndex, answers])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setCurrentAnswer('')
      setShowFeedback(false)
    }
  }, [currentIndex, questions.length])

  const finishQuiz = useCallback((): QuizResult | null => {
    if (!currentLevel || !startTime) return null

    const duration = Math.round((Date.now() - startTime) / 1000)
    let correctCount = 0
    const answerDetails: AnswerDetail[] = []

    questions.forEach(question => {
      const userAnswer = answers.get(question.id) || ''
      const isCorrect = userAnswer === question.answer
      if (isCorrect) correctCount++

      answerDetails.push({
        question_id: question.id,
        question_content: question.content,
        user_answer: userAnswer,
        correct_answer: question.answer,
        is_correct: isCorrect,
        explanation: question.explanation,
      })
    })

    const totalQuestions = questions.length
    const score = Math.round((correctCount / totalQuestions) * 100)

    let grade: Grade
    if (score >= 95) grade = 'S'
    else if (score >= 80) grade = 'A'
    else if (score >= 60) grade = 'B'
    else if (score >= 40) grade = 'C'
    else grade = 'D'

    const wrongAnswers = answerDetails.filter(a => !a.is_correct)
    const weakPoints = wrongAnswers
      .flatMap(a => {
        const q = getQuestionById(a.question_id)
        return q?.knowledge_points || []
      })
      .filter((v, i, a) => a.indexOf(v) === i)

    const errorRate = wrongAnswers.length / totalQuestions
    const suggestions: string[] = []

    if (errorRate < 0.2) {
      suggestions.push('整体掌握不错，可继续挑战下一关卡')
    } else if (errorRate < 0.5) {
      suggestions.push('部分知识点未掌握扎实，建议重新复习相关章节')
    } else if (errorRate < 0.8) {
      suggestions.push('多数知识点未掌握，建议系统复习本关卡内容')
    } else {
      suggestions.push('基础薄弱，建议从关卡1重新开始学习')
    }

    if (weakPoints.length > 0) {
      suggestions.push(`薄弱知识点：${weakPoints.join('、')}`)
    }

    const advice: LearningAdvice = {
      weak_points: weakPoints,
      suggestions,
      recommended_level: errorRate < 0.3 ? Math.min(5, currentLevel + 1) : currentLevel,
    }

    return {
      id: crypto.randomUUID(),
      level_id: currentLevel,
      total_questions: totalQuestions,
      correct_count: correctCount,
      score,
      grade,
      answers: answerDetails,
      duration_seconds: duration,
      advice,
      created_at: new Date().toISOString(),
    }
  }, [currentLevel, questions, answers, startTime])

  const resetQuiz = useCallback(() => {
    setCurrentLevel(null)
    setQuestions([])
    setCurrentIndex(0)
    setAnswers(new Map())
    setCurrentAnswer('')
    setShowFeedback(false)
    setStartTime(0)
    setIsQuizActive(false)
  }, [])

  const currentQuestion = questions[currentIndex] || null

  return {
    currentLevel,
    questions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    setCurrentAnswer,
    showFeedback,
    isQuizActive,
    startQuiz,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    resetQuiz,
    progress: questions.length > 0 ? ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100 : 0,
  }
}
