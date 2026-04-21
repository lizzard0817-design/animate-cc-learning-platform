import { ScoreDisplay } from '@/components/quiz/ScoreDisplay'
import { LearningAdviceComponent } from '@/components/quiz/LearningAdvice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import type { QuizResult } from '@/types'

interface QuizResultPageProps {
  result: QuizResult
  onBack: () => void
  onRetry: () => void
}

export function QuizResultPage({ result, onBack, onRetry }: QuizResultPageProps) {
  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回关卡
          </Button>
          <h1 className="text-2xl font-bold text-foreground">答题成绩</h1>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新挑战
          </Button>
        </div>

        <ScoreDisplay result={result} />

        <div className="mt-8">
          <LearningAdviceComponent advice={result.advice} />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">逐题详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div
                  key={answer.question_id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-1"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {answer.is_correct ? (
                      <CheckCircle className="w-5 h-5 text-status-passed" />
                    ) : (
                      <XCircle className="w-5 h-5 text-status-failed" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {index + 1}. {answer.question_content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        你的答案: <Badge variant={answer.is_correct ? 'success' : 'danger'}>
                          {answer.user_answer || '未作答'}
                        </Badge>
                      </span>
                      {!answer.is_correct && (
                        <span className="text-xs text-muted-foreground">
                          正确答案: <Badge variant="success">{answer.correct_answer}</Badge>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{answer.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
