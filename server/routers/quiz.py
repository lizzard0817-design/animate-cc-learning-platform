from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas import QuizSubmit, QuizResultResponse
import uuid, json, random
from datetime import datetime

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.post("/submit", response_model=QuizResultResponse)
async def submit_quiz(data: QuizSubmit, db: AsyncSession = Depends(get_db)):
    from ..services.question_service import get_questions
    questions = await get_questions(db, data.level_id)
    questions_map = {q.id: q for q in questions}

    correct_count = 0
    answers_detail = []

    for submission in data.answers:
        question = questions_map.get(submission.question_id)
        if not question:
            continue
        is_correct = submission.user_answer == question.answer
        if is_correct:
            correct_count += 1
        answers_detail.append({
            "question_id": submission.question_id,
            "is_correct": is_correct,
            "user_answer": submission.user_answer,
            "correct_answer": question.answer,
            "explanation": question.explanation,
        })

    total = len(questions)
    score = round((correct_count / total) * 100) if total > 0 else 0

    if score >= 95: grade = "S"
    elif score >= 80: grade = "A"
    elif score >= 60: grade = "B"
    elif score >= 40: grade = "C"
    else: grade = "D"

    wrong = [a for a in answers_detail if not a["is_correct"]]
    weak_points = list(set(
        kp for a in wrong
        for kp in ((questions_map.get(a["question_id"]) and questions_map[a["question_id"]].knowledge_points) or "").split(",")
        if kp
    ))

    error_rate = len(wrong) / total if total > 0 else 0
    suggestions = []
    if error_rate < 0.2:
        suggestions.append("整体掌握不错，可继续挑战下一关卡")
    elif error_rate < 0.5:
        suggestions.append("部分知识点未掌握扎实，建议重新复习")
    else:
        suggestions.append("基础薄弱，建议从关卡1重新开始")

    if weak_points:
        suggestions.append(f"薄弱知识点：{', '.join(weak_points)}")

    return QuizResultResponse(
        id=str(uuid.uuid4()),
        level_id=data.level_id,
        total_questions=total,
        correct_count=correct_count,
        score=score,
        grade=grade,
        answers=answers_detail,
        duration_seconds=random.randint(60, 300),
        advice={"weak_points": weak_points, "suggestions": suggestions, "recommended_level": data.level_id},
        created_at=datetime.now().isoformat(),
    )
