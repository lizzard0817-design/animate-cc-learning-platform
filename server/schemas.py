from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CriterionCreate(BaseModel):
    content: str

class ScreenshotUpload(BaseModel):
    pass

class GradingSubmit(BaseModel):
    rubric_id: str
    screenshot_path: str

class CriterionResult(BaseModel):
    name: str
    max_score: int
    score: int
    status: str
    feedback: str

class GradingResultResponse(BaseModel):
    id: str
    rubric_id: str
    screenshot_name: str
    total_score: int
    max_score: int
    grade: str
    criteria_results: List[CriterionResult]
    overall_feedback: str
    created_at: str

class QuestionCreate(BaseModel):
    level_id: int
    type: str
    content: str
    options: List[dict] = []
    answer: str
    explanation: str = ""
    knowledge_points: List[str] = []

class QuestionUpdate(BaseModel):
    level_id: Optional[int] = None
    type: Optional[str] = None
    content: Optional[str] = None
    options: Optional[List[dict]] = None
    answer: Optional[str] = None
    explanation: Optional[str] = None
    knowledge_points: Optional[List[str]] = None

class QuestionResponse(BaseModel):
    id: str
    level_id: int
    type: str
    content: str
    options: List[dict]
    answer: str
    explanation: str
    knowledge_points: List[str]
    is_ai_generated: bool
    created_at: str
    updated_at: str

class AnswerSubmission(BaseModel):
    question_id: str
    user_answer: str

class QuizSubmit(BaseModel):
    level_id: int
    answers: List[AnswerSubmission]

class QuizResultResponse(BaseModel):
    id: str
    level_id: int
    total_questions: int
    correct_count: int
    score: int
    grade: str
    answers: List[dict]
    duration_seconds: int
    advice: dict
    created_at: str

class AIGenerateRequest(BaseModel):
    level_id: int
    count: int = 3

class QuestionStats(BaseModel):
    total: int
    level_count: int
    by_level: dict
    ai_generated_count: int
