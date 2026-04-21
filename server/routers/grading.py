from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.grading_service import create_rubric, create_grading_record
from services.ai_service import generate_mock_results, calculate_grade, generate_overall_feedback
from schemas import CriterionCreate
import json

router = APIRouter(prefix="/api/grading", tags=["grading"])

@router.post("/rubric")
async def upload_rubric(data: CriterionCreate, db: AsyncSession = Depends(get_db)):
    rubric, criteria = await create_rubric(db, data.content)
    return {"rubric_id": rubric.id, "criteria": criteria}

@router.post("/submit")
async def submit_grading(
    rubric_id: str,
    screenshot_name: str,
    db: AsyncSession = Depends(get_db)
):
    record = await create_grading_record(db, rubric_id, f"/uploads/{screenshot_name}", screenshot_name)
    return {"grading_id": record.id}
