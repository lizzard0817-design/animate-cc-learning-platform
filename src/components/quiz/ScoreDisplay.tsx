import { Card, CardContent } from '@/components/ui/card'
import type { QuizResult } from '@/types'

interface ScoreDisplayProps {
  result: QuizResult
}

const gradeConfig = {
  S: { color: 'bg-grade-s text-white', label: '大师级！完美掌握！', emoji: '🏆' },
  A: { color: 'bg-grade-a text-white', label: '优秀！掌握扎实！', emoji: '🌟' },
  B: { color: 'bg-grade-b text-white', label: '良好，继续加油！', emoji: '👍' },
  C: { color: 'bg-grade-c text-white', label: '及格，需要多练习', emoji: '💪' },
  D: { color: 'bg-grade-d text-white', label: '需要重新学习', emoji: '📚' },
}

export function ScoreDisplay({ result }: ScoreDisplayProps) {
  const config = gradeConfig[result.grade]
  const minutes = Math.floor(result.duration_seconds / 60)
  const seconds = result.duration_seconds % 60

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-4">
          <span className="text-4xl">{config.emoji}</span>
        </div>

        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${config.color}`}>
          <span className="text-4xl font-bold">{result.grade}</span>
        </div>

        <p className="text-lg text-foreground mb-2">{config.label}</p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-surface-1">
            <p className="text-2xl font-bold text-foreground">{result.score}分</p>
            <p className="text-xs text-muted-foreground">总分</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-1">
            <p className="text-2xl font-bold text-foreground">
              {result.correct_count}/{result.total_questions}
            </p>
            <p className="text-xs text-muted-foreground">正确</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-1">
            <p className="text-2xl font-bold text-foreground">
              {minutes}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-xs text-muted-foreground">用时</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
