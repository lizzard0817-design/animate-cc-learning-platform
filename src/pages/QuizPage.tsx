import { useState, useCallback } from 'react'
import { LevelMap } from '@/components/quiz/LevelMap'
import { QuestionCardComponent } from '@/components/quiz/QuestionCard'
import { QuizProgressComponent } from '@/components/quiz/QuizProgress'
import { Timer } from '@/components/quiz/Timer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ChevronRight, CheckCircle, XCircle, Settings } from 'lucide-react'
import { useQuiz } from '@/hooks/useQuiz'
import { LEVEL_CONFIG } from '@/data/levelConfig'
import type { QuizResult, Toast } from '@/types'
import { cn } from '@/lib/utils'

interface QuizPageProps {
  onBack: () => void
  onComplete: (result: QuizResult) => void
  onAdmin: () => void
  addToast: (message: string, type: Toast['type']) => void
}

export function QuizPage({ onBack, onComplete, onAdmin }: QuizPageProps) {
  const {
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
  } = useQuiz()

  const [bestScores, setBestScores] = useState<Record<number, number>>({ 1: 80 })
  const [currentScore, setCurrentScore] = useState(0)

  const handleSelectLevel = useCallback((levelId: number) => {
    startQuiz(levelId)
    setCurrentScore(0)
  }, [startQuiz])

  const handleSubmitAnswer = useCallback(() => {
    if (!currentQuestion || !currentAnswer) return
    submitAnswer()

    if (currentAnswer === currentQuestion.answer) {
      setCurrentScore(prev => prev + Math.round(100 / questions.length))
    }
  }, [currentQuestion, currentAnswer, submitAnswer, questions.length])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      nextQuestion()
    } else {
      const result = finishQuiz()
      if (result) {
        setBestScores(prev => ({
          ...prev,
          [result.level_id]: Math.max(prev[result.level_id] || 0, result.score),
        }))
        onComplete(result)
      }
    }
  }, [currentIndex, questions.length, nextQuestion, finishQuiz, onComplete])

  if (!isQuizActive || !currentLevel) {
    return (
      <div className="min-h-screen bg-surface-0">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
            <h1 className="text-2xl font-bold text-foreground">游戏化学习</h1>
            <Button variant="outline" size="icon" onClick={onAdmin}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <LevelMap bestScores={bestScores} onSelectLevel={handleSelectLevel} />
        </div>
      </div>
    )
  }

  const level = LEVEL_CONFIG.find(l => l.id === currentLevel)

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => { onBack() }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            退出
          </Button>
          <h2 className="text-lg font-semibold text-foreground">
            {level?.icon} {level?.name}
          </h2>
          <Timer startTime={Date.now()} />
        </div>

        <div className="mb-6">
          <QuizProgressComponent
            current={currentIndex + 1}
            total={questions.length}
            score={currentScore}
          />
        </div>

        {currentQuestion && (
          <>
            <QuestionCardComponent
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onSelectAnswer={setCurrentAnswer}
              showFeedback={showFeedback}
            />

            {showFeedback && (
              <Card className={cn(
                'mt-4 border-l-4',
                currentAnswer === currentQuestion.answer
                  ? 'border-status-passed bg-status-passed/5'
                  : 'border-status-failed bg-status-failed/5'
              )}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {currentAnswer === currentQuestion.answer ? (
                      <CheckCircle className="w-5 h-5 text-status-passed" />
                    ) : (
                      <XCircle className="w-5 h-5 text-status-failed" />
                    )}
                    <span className="font-medium text-foreground">
                      {currentAnswer === currentQuestion.answer ? '回答正确！' : '回答错误'}
                    </span>
                    {currentAnswer !== currentQuestion.answer && (
                      <Badge variant="success">正确答案：{currentQuestion.answer}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-6 flex justify-end">
              {!showFeedback ? (
                <Button
                  size="lg"
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer}
                >
                  提交答案
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleNext}
                >
                  {currentIndex < questions.length - 1 ? '下一题' : '查看成绩'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
