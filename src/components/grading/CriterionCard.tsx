import type { CriterionResult } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CriterionCardProps {
  result: CriterionResult
}

export function CriterionCard({ result }: CriterionCardProps) {
  const statusConfig = {
    passed: {
      icon: CheckCircle,
      color: 'text-status-passed',
      bgColor: 'bg-status-passed/10',
      label: '通过',
    },
    partial: {
      icon: AlertTriangle,
      color: 'text-status-partial',
      bgColor: 'bg-status-partial/10',
      label: '部分达标',
    },
    failed: {
      icon: XCircle,
      color: 'text-status-failed',
      bgColor: 'bg-status-failed/10',
      label: '未达标',
    },
  }

  const config = statusConfig[result.status]
  const Icon = config.icon

  return (
    <Card className={cn('border-l-4', config.bgColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{result.name}</h3>
          <div className="flex items-center gap-2">
            <Icon className={cn('w-5 h-5', config.color)} />
            <Badge variant={result.status === 'passed' ? 'success' : result.status === 'partial' ? 'warning' : 'danger'}>
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  result.status === 'passed' && 'bg-status-passed',
                  result.status === 'partial' && 'bg-status-partial',
                  result.status === 'failed' && 'bg-status-failed'
                )}
                style={{ width: `${(result.score / result.max_score) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">
            {result.score}/{result.max_score}
          </span>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{result.feedback}</p>
      </CardContent>
    </Card>
  )
}
