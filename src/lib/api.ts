// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 通用请求函数
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// AI 批改 API
export interface GradeSubmissionParams {
  rubric_id: string;
  rubric_criteria: Array<{
    name: string;
    max_score: number;
    description: string;
  }>;
  screenshot_name: string;
  screenshot_data?: string; // base64
}

export interface GradeSubmissionResult {
  id: string;
  rubric_id: string;
  screenshot_name: string;
  total_score: number;
  max_score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  criteria_results: Array<{
    name: string;
    max_score: number;
    score: number;
    status: 'passed' | 'partial' | 'failed';
    feedback: string;
  }>;
  overall_feedback: string;
  created_at: string;
}

export async function gradeSubmission(params: GradeSubmissionParams): Promise<GradeSubmissionResult> {
  return request<GradeSubmissionResult>('/api/grading/submit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 题库 API
export interface Question {
  id: string;
  level: number;
  type: 'choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  knowledge_points: string[];
}

export async function getQuestions(level?: number): Promise<Question[]> {
  const query = level ? `?level=${level}` : '';
  return request<Question[]>(`/api/questions${query}`);
}

// AI 生成 API
export interface AIGenerateParams {
  prompt: string;
  level?: number;
  count?: number;
}

export interface AIGenerateResult {
  questions: Question[];
  generated_at: string;
}

export async function aiGenerate(params: AIGenerateParams): Promise<AIGenerateResult> {
  return request<AIGenerateResult>('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 健康检查
export async function healthCheck(): Promise<{ status: string; message: string }> {
  return request<{ status: string; message: string }>('/');
}
