import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LearningAdvice } from '@/types'
import { Lightbulb, AlertTriangle } from 'lucide-react'

interface LearningAdviceProps {
  advice: LearningAdvice
}

export function LearningAdviceComponent({ advice }: LearningAdviceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-grade-s" />
          个性化学习建议
        </CardTitle>
      </CardHeader>
      <CardContent>
        {advice.weak_points.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-status-partial" />
              薄弱知识点
            </h4>
            <div className="flex flex-wrap gap-2">
              {advice.weak_points.map((point, i) => (
                <Badge key={i} variant="warning">{point}</Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">建议</h4>
          <ul className="space-y-2">
            {advice.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
