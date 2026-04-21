import { Progress } from '@/components/ui/progress'
import type { GradingStep } from '@/types'
import { CheckCircle, Loader2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GradingProgressProps {
  steps: GradingStep[]
}

export function GradingProgressComponent({ steps }: GradingProgressProps) {
  const completedCount = steps.filter(s => s.status === 'completed').length
  const overallProgress = (completedCount / steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-xl font-bold text-foreground text-center mb-6">
        AI批改进行中...
      </h2>

      <Progress value={overallProgress} className="mb-8" showLabel />

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-lg border',
              step.status === 'completed' && 'border-status-passed/30 bg-status-passed/5',
              step.status === 'processing' && 'border-primary/30 bg-primary/5',
              step.status === 'pending' && 'border-border opacity-50'
            )}
          >
            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <CheckCircle className="w-6 h-6 text-status-passed" />
              )}
              {step.status === 'processing' && (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              )}
              {step.status === 'pending' && (
                <Clock className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{step.label}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            {step.status === 'processing' && (
              <span className="text-sm font-medium text-primary">
                {step.progress}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
