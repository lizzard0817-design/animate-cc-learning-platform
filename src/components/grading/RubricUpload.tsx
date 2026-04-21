import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RUBRIC_TEMPLATES, type RubricTemplate } from '@/data/mockGrading'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RubricUploadProps {
  selectedId: string | null
  onSelect: (template: RubricTemplate) => void
}

export function RubricUpload({ selectedId, onSelect }: RubricUploadProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          选择评分标准
        </CardTitle>
        <CardDescription>
          从预设的评分标准模板中选择一个
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {RUBRIC_TEMPLATES.map((template) => {
            const isSelected = selectedId === template.id
            const isExpanded = expandedId === template.id
            const totalScore = template.criteria.reduce((sum, c) => sum + c.max_score, 0)

            return (
              <div key={template.id}>
                <button
                  onClick={() => onSelect(template)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant={isSelected ? 'default' : 'outline'}>
                        {template.criteria.length} 项 / {totalScore} 分
                      </Badge>
                      <button
                        onClick={(e) => toggleExpand(template.id, e)}
                        className="p-1 hover:bg-surface-2 rounded"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 ml-2 pl-4 border-l-2 border-border space-y-2">
                    {template.criteria.map((criterion, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{criterion.name}</span>
                          <Badge variant="outline" className="text-xs">{criterion.max_score}分</Badge>
                        </div>
                        {criterion.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedId && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground">
              已选择：<span className="font-semibold">{RUBRIC_TEMPLATES.find(t => t.id === selectedId)?.name}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
