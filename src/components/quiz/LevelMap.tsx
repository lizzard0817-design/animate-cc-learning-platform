import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LEVEL_CONFIG } from '@/data/levelConfig'
import { Lock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LevelMapProps {
  bestScores: Record<number, number>
  onSelectLevel: (levelId: number) => void
}

const gradeColors: Record<string, string> = {
  S: 'text-grade-s',
  A: 'text-grade-a',
  B: 'text-grade-b',
  C: 'text-grade-c',
  D: 'text-grade-d',
}

export function LevelMap({ bestScores, onSelectLevel }: LevelMapProps) {
  const getScoreGrade = (score: number): string => {
    if (score >= 95) return 'S'
    if (score >= 80) return 'A'
    if (score >= 60) return 'B'
    if (score >= 40) return 'C'
    return 'D'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        选择关卡
      </h2>

      <div className="space-y-4">
        {LEVEL_CONFIG.map((level, index) => {
          const isUnlocked = index === 0 || (bestScores[LEVEL_CONFIG[index - 1].id] ?? 0) >= level.unlock_required_score
          const bestScore = bestScores[level.id]
          const bestGrade = bestScore ? getScoreGrade(bestScore) : null

          return (
            <Card
              key={level.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                !isUnlocked && 'opacity-60',
                isUnlocked && 'hover:border-primary/30'
              )}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                    isUnlocked ? 'bg-primary/10' : 'bg-surface-2'
                  )}>
                    {isUnlocked ? level.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{level.name}</h3>
                      <Badge variant={level.difficulty === 'beginner' ? 'success' : level.difficulty === 'elementary' ? 'default' : level.difficulty === 'intermediate' ? 'secondary' : level.difficulty === 'advanced' ? 'warning' : 'danger'}>
                        {level.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {bestScore !== undefined && bestGrade && (
                      <div className="text-right">
                        <p className={cn('text-lg font-bold', gradeColors[bestGrade])}>
                          {bestGrade}
                        </p>
                        <p className="text-xs text-muted-foreground">{bestScore}分</p>
                      </div>
                    )}
                    {isUnlocked && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
