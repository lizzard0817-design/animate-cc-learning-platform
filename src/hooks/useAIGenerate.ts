import { useState, useCallback } from 'react'
import type { Question } from '@/types'
import { LEVEL_CONFIG } from '@/data/levelConfig'

const QUESTION_TEMPLATES = {
  single: [
    {
      template: '在Animate CC中，关于{point}的描述，以下说法正确的是？',
      options: [
        { label: 'A', text: '正确描述（正确答案）' },
        { label: 'B', text: '常见误解1' },
        { label: 'C', text: '常见误解2' },
        { label: 'D', text: '无关概念' },
      ],
      answer: 'A',
      explanation: '{point}是Animate CC的重要功能，正确理解和使用可以提高工作效率。',
    },
  ],
  multiple: [
    {
      template: '在Animate CC中，关于{point}的描述，以下哪些是正确的？（多选）',
      options: [
        { label: 'A', text: '正确描述1（正确答案）' },
        { label: 'B', text: '正确描述2（正确答案）' },
        { label: 'C', text: '错误描述' },
        { label: 'D', text: '正确描述3（正确答案）' },
      ],
      answer: 'ABD',
      explanation: '{point}包含多个方面的知识点，掌握这些要点有助于更好地使用该功能。',
    },
  ],
  judgment: [
    {
      template: '在Animate CC中，{point}是默认开启的功能。',
      options: [],
      answer: 'true',
      explanation: '{point}是Animate CC的标准功能之一，可以帮助用户更高效地完成动画制作。',
    },
  ],
}

export function useAIGenerate() {
  const [_isGenerating, _setIsGenerating] = useState(false)

  const generateQuestions = useCallback((levelId: number, _count: number = 3): Question[] => {
    const level = LEVEL_CONFIG.find(l => l.id === levelId)
    if (!level) return []

    const knowledgePoints = level.knowledge_points
    const generated: Question[] = []

    const types: Array<'single' | 'multiple' | 'judgment'> = ['single', 'multiple', 'judgment']

    types.forEach((type, i) => {
      const point = knowledgePoints[i % knowledgePoints.length]
      const template = QUESTION_TEMPLATES[type][0]

      const content = template.template.replace('{point}', point)
      const explanation = template.explanation.replace('{point}', point)

      const options = type === 'judgment' ? [] : template.options.map(opt => ({
        ...opt,
        text: opt.text.replace('正确描述', `${point}相关功能`).replace('错误描述', `与${point}无关的功能`),
      }))

      generated.push({
        id: crypto.randomUUID(),
        level_id: levelId as 1 | 2 | 3 | 4 | 5,
        type,
        content,
        options,
        answer: template.answer,
        explanation,
        knowledge_points: [point],
        is_ai_generated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    })

    return generated
  }, [])

  return {
    _isGenerating,
    generateQuestions,
  }
}
