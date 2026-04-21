from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services import question_service
from schemas import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionStats
import json

router = APIRouter(prefix="/api/questions", tags=["questions"])

def question_to_dict(q):
    return {
        "id": q.id,
        "level_id": q.level_id,
        "type": q.type,
        "content": q.content,
        "options": json.loads(q.options_json) if q.options_json else [],
        "answer": q.answer,
        "explanation": q.explanation,
        "knowledge_points": q.knowledge_points.split(",") if q.knowledge_points else [],
        "is_ai_generated": q.is_ai_generated,
        "created_at": str(q.created_at),
        "updated_at": str(q.updated_at),
    }

@router.get("/all")
async def get_all_questions(db: AsyncSession = Depends(get_db)):
    questions = await question_service.get_questions(db)
    return [question_to_dict(q) for q in questions]

@router.get("")
async def get_questions_by_level(level: int = None, db: AsyncSession = Depends(get_db)):
    questions = await question_service.get_questions(db, level)
    return [question_to_dict(q) for q in questions]

@router.post("")
async def create_question(data: QuestionCreate, db: AsyncSession = Depends(get_db)):
    question = await question_service.create_question(db, data)
    return question_to_dict(question)

@router.put("/{question_id}")
async def update_question(question_id: str, data: QuestionUpdate, db: AsyncSession = Depends(get_db)):
    question = await question_service.update_question(db, question_id, data)
    if not question:
        return {"error": "Question not found"}
    return question_to_dict(question)

@router.delete("/{question_id}")
async def delete_question(question_id: str, db: AsyncSession = Depends(get_db)):
    await question_service.delete_question(db, question_id)
    return {"success": True}

@router.delete("/reset")
async def reset_questions(db: AsyncSession = Depends(get_db)):
    await question_service.reset_questions(db)
    return {"success": True}

@router.get("/stats", response_model=QuestionStats)
async def get_stats(db: AsyncSession = Depends(get_db)):
    return await question_service.get_stats(db)
