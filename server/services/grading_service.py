from sqlalchemy.ext.asyncio import AsyncSession
from models import GradingRecord, Rubric
from services.ai_service import generate_mock_results, calculate_grade, generate_overall_feedback
import uuid, json

async def create_rubric(db: AsyncSession, content: str):
    criteria = []
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 3:
            criteria.append({
                "name": parts[0],
                "max_score": int(parts[1]),
                "description": parts[2],
            })

    rubric = Rubric(
        id=str(uuid.uuid4()),
        content=content,
        criteria_json=json.dumps(criteria),
    )
    db.add(rubric)
    await db.commit()
    await db.refresh(rubric)
    return rubric, criteria

async def create_grading_record(db: AsyncSession, rubric_id: str, screenshot_path: str, screenshot_name: str):
    import uuid
    record = GradingRecord(
        id=str(uuid.uuid4()),
        rubric_id=rubric_id,
        screenshot_path=screenshot_path,
        screenshot_name=screenshot_name,
        status="completed",
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record
