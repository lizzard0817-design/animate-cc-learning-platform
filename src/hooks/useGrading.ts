import { useState, useCallback, useRef } from 'react'
import type { GradingStep, GradingResult, Grade, Criterion } from '@/types'
import { GRADING_STEPS, generateMockResults, generateOverallFeedback, calculateGrade, type RubricTemplate } from '@/data/mockGrading'

export function useGrading() {
  const [selectedTemplate, setSelectedTemplate] = useState<RubricTemplate | null>(null)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [isGrading, setIsGrading] = useState(false)
  const [steps, setSteps] = useState<GradingStep[]>(
    GRADING_STEPS.map(s => ({ ...s, status: 'pending' as const, progress: 0 }))
  )
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }

  const handleTemplateSelect = useCallback((template: RubricTemplate) => {
    setSelectedTemplate(template)
  }, [])

  const handleScreenshotUpload = useCallback((file: File) => {
    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const resetGrading = useCallback(() => {
    clearTimers()
    setIsGrading(false)
    setSelectedTemplate(null)
    setScreenshotFile(null)
    setScreenshotPreview(null)
    setSteps(GRADING_STEPS.map(s => ({ ...s, status: 'pending' as const, progress: 0 })))
    setGradingResult(null)
  }, [])

  const startGrading = useCallback(() => {
    if (!selectedTemplate || !screenshotFile) return

    setIsGrading(true)
    setGradingResult(null)
    setSteps(GRADING_STEPS.map(s => ({ ...s, status: 'pending' as const, progress: 0 })))

    const criteria: Criterion[] = selectedTemplate.criteria
    const stepDurations = [1200, 1800, 2000]
    let elapsed = 0

    GRADING_STEPS.forEach((_, i) => {
      const startTimer = setTimeout(() => {
        setSteps(prev =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'processing' as const, progress: 0 } : s
          )
        )
      }, elapsed)
      timerRef.current.push(startTimer)

      const stepDuration = stepDurations[i]
      for (let p = 0; p <= 100; p += 10) {
        const progressTimer = setTimeout(() => {
          setSteps(prev =>
            prev.map((s, idx) =>
              idx === i ? { ...s, progress: p } : s
            )
          )
        }, elapsed + (stepDuration * p) / 100)
        timerRef.current.push(progressTimer)
      }

      const completeTimer = setTimeout(() => {
        setSteps(prev =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'completed' as const, progress: 100 } : s
          )
        )
      }, elapsed + stepDuration)
      timerRef.current.push(completeTimer)

      elapsed += stepDuration
    })

    const finalTimer = setTimeout(() => {
      const criteriaResults = generateMockResults(criteria)
      const totalScore = criteriaResults.reduce((sum, r) => sum + r.score, 0)
      const maxScore = criteria.reduce((sum, c) => sum + c.max_score, 0)
      const grade: Grade = calculateGrade(totalScore, maxScore)
      const overallFeedback = generateOverallFeedback(totalScore, maxScore)

      const result: GradingResult = {
        id: crypto.randomUUID(),
        rubric_id: selectedTemplate.id,
        screenshot_name: screenshotFile.name,
        screenshot_preview: screenshotPreview || '',
        total_score: totalScore,
        max_score: maxScore,
        grade,
        criteria_results: criteriaResults,
        overall_feedback: overallFeedback,
        created_at: new Date().toISOString(),
      }

      setGradingResult(result)
      setIsGrading(false)
    }, elapsed + 500)
    timerRef.current.push(finalTimer)
  }, [selectedTemplate, screenshotFile, screenshotPreview])

  return {
    selectedTemplate,
    screenshotFile,
    screenshotPreview,
    isGrading,
    steps,
    gradingResult,
    handleTemplateSelect,
    handleScreenshotUpload,
    startGrading,
    resetGrading,
    canStart: !!selectedTemplate && !!screenshotFile && !isGrading,
  }
}
