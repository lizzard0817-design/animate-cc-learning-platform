// ========== App 视图类型 ==========

export type AppView = 'home' | 'grading' | 'quiz' | 'quiz-result' | 'admin'

// ========== 关卡类型 ==========

export interface Level {
  id: 1 | 2 | 3 | 4 | 5
  name: string
  description: string
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert'
  knowledge_points: string[]
  unlock_required_score: number
  icon: string
  color: string
}

// ========== 题目类型 ==========

export type QuestionType = 'single' | 'multiple' | 'judgment'

export interface Option {
  label: string
  text: string
}

export interface Question {
  id: string
  level_id: 1 | 2 | 3 | 4 | 5
  type: QuestionType
  content: string
  options: Option[]
  answer: string
  explanation: string
  knowledge_points: string[]
  is_ai_generated: boolean
  created_at: string
  updated_at: string
}

// ========== 答题类型 ==========

export interface AnswerSubmission {
  question_id: string
  user_answer: string
}

export interface AnswerDetail {
  question_id: string
  question_content: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  explanation: string
}

export interface LearningAdvice {
  weak_points: string[]
  suggestions: string[]
  recommended_level: number
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'

export interface QuizResult {
  id: string
  level_id: number
  total_questions: number
  correct_count: number
  score: number
  grade: Grade
  answers: AnswerDetail[]
  duration_seconds: number
  advice: LearningAdvice
  created_at: string
}

// ========== 评分标准类型 ==========

export interface Criterion {
  name: string
  max_score: number
  description: string
}

export type CriterionStatus = 'passed' | 'partial' | 'failed'

export interface CriterionResult {
  name: string
  max_score: number
  score: number
  status: CriterionStatus
  feedback: string
}

export interface GradingResult {
  id: string
  rubric_id: string
  screenshot_name: string
  screenshot_preview: string
  total_score: number
  max_score: number
  grade: Grade
  criteria_results: CriterionResult[]
  overall_feedback: string
  created_at: string
}

// ========== 批改进度类型 ==========

export interface GradingStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'processing' | 'completed'
  progress: number
}

// ========== 题库统计类型 ==========

export interface QuestionStats {
  total: number
  level_count: number
  by_level: Record<number, number>
  ai_generated_count: number
}

// ========== 工具类型 ==========

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}
