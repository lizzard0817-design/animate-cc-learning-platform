import type { GradingResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CriterionCard } from '@/components/grading/CriterionCard'
import { ArrowLeft, Award, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GradingResultProps {
  result: GradingResult
  onBack: () => void
  onReset: () => void
}

const gradeConfig = {
  S: { color: 'bg-grade-s text-white', label: 'S级 · 大师' },
  A: { color: 'bg-grade-a text-white', label: 'A级 · 优秀' },
  B: { color: 'bg-grade-b text-white', label: 'B级 · 良好' },
  C: { color: 'bg-grade-c text-white', label: 'C级 · 及格' },
  D: { color: 'bg-grade-d text-white', label: 'D级 · 需努力' },
}

export function GradingResultComponent({ result, onBack, onReset }: GradingResultProps) {
  const gradeInfo = gradeConfig[result.grade]
  const percentage = Math.round((result.total_score / result.max_score) * 100)

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary" />
            批改结果
          </h1>
          <Button variant="outline" onClick={onReset}>
            重新批改
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">作品信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {result.screenshot_preview && (
                <div className="w-32 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img
                    src={result.screenshot_preview}
                    alt="Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{result.screenshot_name}</p>
                <p className="text-xs text-muted-foreground">
                  批改时间: {new Date(result.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn('inline-flex items-center justify-center w-20 h-20 rounded-full mb-4', gradeInfo.color)}>
                <span className="text-3xl font-bold">{result.grade}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{gradeInfo.label}</p>
              <p className="text-4xl font-bold text-foreground">
                {result.total_score}<span className="text-xl text-muted-foreground">/{result.max_score}</span>
              </p>
              <p className="text-lg text-muted-foreground mt-1">
                得分率: {percentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-foreground">逐项判定</h2>
          {result.criteria_results.map((criterion, index) => (
            <CriterionCard key={index} result={criterion} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" />
              AI综合反馈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.overall_feedback}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
