from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.ai_service import generate_questions
from services.question_service import get_questions
from schemas import AIGenerateRequest, QuestionResponse
import uuid, json
from datetime import datetime

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/generate-questions")
async def generate_questions_endpoint(data: AIGenerateRequest, db: AsyncSession = Depends(get_db)):
    from ..models import Question
    questions = await get_questions(db, data.level_id)
    knowledge_points = list(set(
        kp for q in questions
        for kp in (q.knowledge_points or "").split(",")
        if kp
    ))

    generated = generate_questions(data.level_id, knowledge_points or [f"关卡{data.level_id}知识点"], data.count)

    result = []
    for q in generated:
        db_question = Question(
            id=str(uuid.uuid4()),
            level_id=data.level_id,
            type=q["type"],
            content=q["content"],
            options_json=json.dumps(q["options"]),
            answer=q["answer"],
            explanation=q["explanation"],
            knowledge_points=",".join(q["knowledge_points"]),
            is_ai_generated=True,
        )
        db.add(db_question)
        result.append({
            "id": db_question.id,
            "level_id": db_question.level_id,
            "type": db_question.type,
            "content": db_question.content,
            "options": q["options"],
            "answer": db_question.answer,
            "explanation": db_question.explanation,
            "knowledge_points": q["knowledge_points"],
            "is_ai_generated": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        })

    await db.commit()
    return result
