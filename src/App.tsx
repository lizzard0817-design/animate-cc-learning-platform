import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { HomePage } from '@/pages/HomePage'
import { GradingPage } from '@/pages/GradingPage'
import { QuizPage } from '@/pages/QuizPage'
import { QuizResultPage } from '@/pages/QuizResultPage'
import { AdminPage } from '@/pages/AdminPage'
import { ToastContainer } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppView, Toast, QuizResult } from '@/types'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleNavigate = (view: AppView) => {
    setCurrentView(view)
  }

  const handleStartGrading = () => {
    setCurrentView('grading')
  }

  const handleStartQuiz = () => {
    setCurrentView('quiz')
  }

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result)
    setCurrentView('quiz-result')
  }

  const handleBackToQuiz = () => {
    setQuizResult(null)
    setCurrentView('quiz')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {currentView !== 'grading' && currentView !== 'quiz' && currentView !== 'quiz-result' && currentView !== 'admin' && (
        <Sidebar
          currentView={currentView}
          onViewChange={handleNavigate}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage
                onNavigate={(view) => {
                  if (view === 'grading') handleStartGrading()
                  else handleStartQuiz()
                }}
              />
            </motion.div>
          )}

          {currentView === 'grading' && (
            <motion.div
              key="grading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GradingPage onBack={() => setCurrentView('home')} addToast={addToast} />
            </motion.div>
          )}

          {currentView === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QuizPage
                onBack={() => setCurrentView('home')}
                onComplete={handleQuizComplete}
                onAdmin={() => setCurrentView('admin')}
                addToast={addToast}
              />
            </motion.div>
          )}

          {currentView === 'quiz-result' && quizResult && (
            <motion.div
              key="quiz-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QuizResultPage
                result={quizResult}
                onBack={handleBackToQuiz}
                onRetry={() => {
                  setQuizResult(null)
                  setCurrentView('quiz')
                }}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPage
                onBack={() => setCurrentView('quiz')}
                addToast={addToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default App
