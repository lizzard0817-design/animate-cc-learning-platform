from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import grading, questions, quiz, ai

app = FastAPI(title="Animate CC 学习平台 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Animate CC 学习平台 API", "docs": "/docs"}

app.include_router(grading.router)
app.include_router(questions.router)
app.include_router(quiz.router)
app.include_router(ai.router)
