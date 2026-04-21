import { RubricUpload } from '@/components/grading/RubricUpload'
import { ScreenshotUpload } from '@/components/grading/ScreenshotUpload'
import { GradingProgressComponent } from '@/components/grading/GradingProgress'
import { GradingResultComponent } from '@/components/grading/GradingResult'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useGrading } from '@/hooks/useGrading'
import type { Toast } from '@/types'

interface GradingPageProps {
  onBack: () => void
  addToast: (message: string, type: Toast['type']) => void
}

export function GradingPage({ onBack, addToast }: GradingPageProps) {
  const {
    selectedTemplate,
    screenshotFile,
    screenshotPreview,
    isGrading,
    steps,
    gradingResult,
    handleTemplateSelect,
    handleScreenshotUpload,
    startGrading,
    resetGrading,
    canStart,
  } = useGrading()

  if (gradingResult) {
    return (
      <GradingResultComponent
        result={gradingResult}
        onBack={onBack}
        onReset={resetGrading}
      />
    )
  }

  if (isGrading) {
    return <GradingProgressComponent steps={steps} />
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI批改智能体
          </h1>
          <div className="w-[100px]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <RubricUpload
            selectedId={selectedTemplate?.id || null}
            onSelect={handleTemplateSelect}
          />
          <ScreenshotUpload
            file={screenshotFile}
            preview={screenshotPreview}
            onUpload={handleScreenshotUpload}
          />
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => {
              startGrading()
              addToast('开始AI批改...', 'info')
            }}
            disabled={!canStart}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            开始AI批改
          </Button>
          {(!selectedTemplate || !screenshotFile) && (
            <p className="text-sm text-muted-foreground mt-3">
              {!selectedTemplate && !screenshotFile
                ? '请先选择评分标准并上传截图'
                : !selectedTemplate
                ? '请先选择评分标准模板'
                : '请先上传截图'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
