import type { Question } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  selectedAnswer: string
  onSelectAnswer: (answer: string) => void
  showFeedback: boolean
}

export function QuestionCardComponent({ question, selectedAnswer, onSelectAnswer, showFeedback }: QuestionCardProps) {
  const typeLabel = {
    single: '单选题',
    multiple: '多选题',
    judgment: '判断题',
  }[question.type]

  if (question.type === 'judgment') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{question.content}</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '正确', value: 'true' },
              { label: '错误', value: 'false' },
            ].map(option => (
              <Button
                key={option.value}
                variant={selectedAnswer === option.value ? 'default' : 'outline'}
                size="lg"
                onClick={() => !showFeedback && onSelectAnswer(option.value)}
                disabled={showFeedback}
                className={cn(
                  'h-16 text-lg',
                  showFeedback && selectedAnswer === option.value && (
                    option.value === question.answer ? 'bg-status-passed hover:bg-status-passed' : 'bg-status-failed hover:bg-status-failed'
                  ),
                  showFeedback && option.value === question.answer && selectedAnswer !== option.value && 'border-status-passed border-2'
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{typeLabel}</Badge>
          {question.type === 'multiple' && (
            <Badge variant="warning">多选</Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{question.content}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map(option => {
            const isSelected = selectedAnswer.includes(option.label)
            const isCorrect = question.answer.includes(option.label)

            return (
              <Button
                key={option.label}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'w-full justify-start h-auto py-3 px-4 text-left',
                  showFeedback && isSelected && !isCorrect && 'bg-status-failed hover:bg-status-failed',
                  showFeedback && isCorrect && !isSelected && 'border-status-passed border-2'
                )}
                onClick={() => !showFeedback && handleOptionSelect(question.type, option.label, selectedAnswer, onSelectAnswer)}
                disabled={showFeedback}
              >
                <span className="font-bold mr-3">{option.label}.</span>
                {option.text}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function handleOptionSelect(
  type: string,
  label: string,
  current: string,
  onSelect: (answer: string) => void
) {
  if (type === 'single') {
    onSelect(label)
  } else if (type === 'multiple') {
    if (current.includes(label)) {
      onSelect(current.replace(label, '').split('').sort().join(''))
    } else {
      onSelect((current + label).split('').sort().join(''))
    }
  }
}
