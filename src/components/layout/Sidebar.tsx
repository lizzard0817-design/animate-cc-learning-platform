import { cn } from '@/lib/utils'
import { AppView } from '@/types'
import {
  Home,
  FileCheck,
  Gamepad2,
  Settings,
} from 'lucide-react'

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

const navItems = [
  { view: 'home' as AppView, label: '首页', icon: Home },
  { view: 'grading' as AppView, label: 'AI批改', icon: FileCheck },
  { view: 'quiz' as AppView, label: '游戏化学习', icon: Gamepad2 },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const showAdminButton = currentView === 'quiz' || currentView === 'quiz-result' || currentView === 'admin'

  return (
    <aside className="flex flex-col w-64 h-screen bg-surface-1 border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          Animate CC
        </h1>
        <p className="text-sm text-muted-foreground mt-1">学习平台</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              currentView === view
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        {showAdminButton && (
          <button
            onClick={() => onViewChange('admin')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              currentView === 'admin'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
            )}
          >
            <Settings className="w-5 h-5" />
            题库管理
          </button>
        )}
      </div>
    </aside>
  )
}
