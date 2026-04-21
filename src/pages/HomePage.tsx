import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileCheck, Gamepad2, ArrowRight, BookOpen, Award, BarChart3 } from 'lucide-react'

interface HomePageProps {
  onNavigate: (view: 'grading' | 'quiz') => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Animate CC 学习平台
          </h1>
          <p className="text-lg text-muted-foreground mt-3">
            AI智能批改 + 游戏化学习，助你掌握 Animate CC 核心技能
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">AI批改智能体</CardTitle>
              <CardDescription>
                上传评分标准和作品截图，AI自动批改并给出详细反馈
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> 自定义评分标准
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> 截图上传批改
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> 逐项判定反馈
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                onClick={() => onNavigate('grading')}
              >
                开始批改 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">游戏化学习</CardTitle>
              <CardDescription>
                5大关卡25道精选题目，从入门到进阶掌握Animate CC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> 5大关卡循序渐进
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> S/A/B/C/D等级评定
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-status-passed">✓</span> 个性化学习建议
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                onClick={() => onNavigate('quiz')}
              >
                开始学习 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-lg bg-surface-1">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">学习关卡</p>
          </div>
          <div className="p-6 rounded-lg bg-surface-1">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">25+</p>
            <p className="text-sm text-muted-foreground">精选试题</p>
          </div>
          <div className="p-6 rounded-lg bg-surface-1">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">AI</p>
            <p className="text-sm text-muted-foreground">智能批改</p>
          </div>
        </div>
      </div>
    </div>
  )
}
