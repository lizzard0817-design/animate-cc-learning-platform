from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from models import Question
from schemas import QuestionCreate, QuestionUpdate

async def get_questions(db: AsyncSession, level_id: int = None):
    query = select(Question)
    if level_id:
        query = query.where(Question.level_id == level_id)
    result = await db.execute(query)
    return result.scalars().all()

async def get_question(db: AsyncSession, question_id: str):
    result = await db.execute(select(Question).where(Question.id == question_id))
    return result.scalar_one_or_none()

async def create_question(db: AsyncSession, question: QuestionCreate):
    import uuid, json
    db_question = Question(
        id=str(uuid.uuid4()),
        level_id=question.level_id,
        type=question.type,
        content=question.content,
        options_json=json.dumps(question.options),
        answer=question.answer,
        explanation=question.explanation,
        knowledge_points=",".join(question.knowledge_points),
    )
    db.add(db_question)
    await db.commit()
    await db.refresh(db_question)
    return db_question

async def update_question(db: AsyncSession, question_id: str, updates: QuestionUpdate):
    import json
    question = await get_question(db, question_id)
    if not question:
        return None
    update_data = updates.model_dump(exclude_unset=True)
    if "options" in update_data:
        question.options_json = json.dumps(update_data.pop("options"))
    if "knowledge_points" in update_data:
        question.knowledge_points = ",".join(update_data.pop("knowledge_points"))
    for key, value in update_data.items():
        setattr(question, key, value)
    await db.commit()
    await db.refresh(question)
    return question

async def delete_question(db: AsyncSession, question_id: str):
    await db.execute(delete(Question).where(Question.id == question_id))
    await db.commit()

async def reset_questions(db: AsyncSession):
    await db.execute(delete(Question))
    await db.commit()

async def get_stats(db: AsyncSession):
    questions = await get_questions(db)
    by_level = {}
    ai_count = 0
    for q in questions:
        by_level[q.level_id] = by_level.get(q.level_id, 0) + 1
        if q.is_ai_generated:
            ai_count += 1
    return {
        "total": len(questions),
        "level_count": len(by_level),
        "by_level": by_level,
        "ai_generated_count": ai_count,
    }
