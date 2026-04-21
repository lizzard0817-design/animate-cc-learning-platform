from sqlalchemy import Column, Integer, Text, Boolean, DateTime, Float
from sqlalchemy.sql import func
from database import Base
import uuid

class Level(Base):
    __tablename__ = "levels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    description = Column(Text)
    difficulty = Column(Text, nullable=False)
    knowledge_points_json = Column(Text)
    unlock_required_score = Column(Float, default=0)
    icon = Column(Text)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    level_id = Column(Integer, nullable=False)
    type = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    options_json = Column(Text)
    answer = Column(Text, nullable=False)
    explanation = Column(Text)
    knowledge_points = Column(Text)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Rubric(Base):
    __tablename__ = "rubrics"
    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    criteria_json = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class GradingRecord(Base):
    __tablename__ = "grading_records"
    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    rubric_id = Column(Text)
    screenshot_path = Column(Text, nullable=False)
    screenshot_name = Column(Text, nullable=False)
    total_score = Column(Float)
    result_json = Column(Text)
    status = Column(Text, default="pending")
    created_at = Column(DateTime, server_default=func.now())

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    level_id = Column(Integer, nullable=False)
    total_questions = Column(Integer)
    correct_count = Column(Integer)
    score = Column(Float)
    grade = Column(Text)
    answers_json = Column(Text)
    duration_seconds = Column(Integer)
    advice_json = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
