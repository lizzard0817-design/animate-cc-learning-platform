import { Progress } from '@/components/ui/progress'

interface QuizProgressProps {
  current: number
  total: number
  score: number
}

export function QuizProgressComponent({ current, total, score }: QuizProgressProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">
        {current}/{total}
      </span>
      <Progress value={(current / total) * 100} className="flex-1" />
      <span className="text-sm font-medium text-primary">
        得分: {score}
      </span>
    </div>
  )
}
