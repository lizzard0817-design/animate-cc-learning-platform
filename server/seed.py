import asyncio
import json
import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine, async_session, Base
from models import Level, Question

LEVELS = [
    {
        "id": 1, "name": "初识 Animate", "description": "了解 Animate CC 的基本界面、工具面板和基础操作",
        "difficulty": "beginner", "knowledge_points_json": json.dumps(["界面布局", "工具面板", "舞台", "时间轴", "文档设置"]),
        "unlock_required_score": 0, "icon": "🏰",
    },
    {
        "id": 2, "name": "绘图工具", "description": "掌握各种绘图工具的使用方法和矢量图形编辑技巧",
        "difficulty": "elementary", "knowledge_points_json": json.dumps(["选择工具", "钢笔工具", "形状工具", "画笔工具", "填充描边", "对齐分布"]),
        "unlock_required_score": 60, "icon": "🎨",
    },
    {
        "id": 3, "name": "动画制作", "description": "学习关键帧动画、补间动画和动画预设的使用",
        "difficulty": "intermediate", "knowledge_points_json": json.dumps(["关键帧", "形状补间", "动画补间", "传统补间", "动画编辑器", "引导层", "遮罩层"]),
        "unlock_required_score": 60, "icon": "🎬",
    },
    {
        "id": 4, "name": "交互设计", "description": "掌握元件、实例、按钮和ActionScript基础交互",
        "difficulty": "advanced", "knowledge_points_json": json.dumps(["元件类型", "按钮状态", "实例属性", "AS3语法", "事件监听", "时间轴控制"]),
        "unlock_required_score": 60, "icon": "🎮",
    },
    {
        "id": 5, "name": "进阶技巧", "description": "学习高级动画技术、音视频集成和发布导出",
        "difficulty": "expert", "knowledge_points_json": json.dumps(["IK骨骼", "3D变换", "音频同步", "视频嵌入", "发布导出", "性能优化"]),
        "unlock_required_score": 60, "icon": "🚀",
    },
]

QUESTIONS = [
    # Level 1
    {"level_id": 1, "type": "single", "content": "Animate CC 新建文档时，默认推荐的文档类型是什么？",
     "options": [{"label": "A", "text": "ActionScript 3.0"}, {"label": "B", "text": "HTML5 Canvas"}, {"label": "C", "text": "WebGL"}, {"label": "D", "text": "AIR for iOS"}],
     "answer": "B", "explanation": "从 Animate CC 2017 版本开始，新建文档默认类型为 HTML5 Canvas。", "knowledge_points": "文档设置"},
    {"level_id": 1, "type": "single", "content": "在 Animate CC 的时间轴上，空心圆点表示什么？",
     "options": [{"label": "A", "text": "普通帧"}, {"label": "B", "text": "空白关键帧"}, {"label": "C", "text": "关键帧（有内容）"}, {"label": "D", "text": "动作帧"}],
     "answer": "B", "explanation": "空心圆点表示空白关键帧。", "knowledge_points": "时间轴"},
    {"level_id": 1, "type": "judgment", "content": "在 Animate CC 中，舞台大小一旦设置后就不能再修改。",
     "options": [], "answer": "false", "explanation": "可以通过修改>文档随时修改舞台大小。", "knowledge_points": "舞台"},
    # Level 2
    {"level_id": 2, "type": "single", "content": "使用钢笔工具绘制路径时，按什么键可以结束当前路径的绘制？",
     "options": [{"label": "A", "text": "Esc"}, {"label": "B", "text": "Enter"}, {"label": "C", "text": "Shift"}, {"label": "D", "text": "Ctrl"}],
     "answer": "A", "explanation": "按 Esc 键可以结束当前钢笔工具的路径绘制。", "knowledge_points": "钢笔工具"},
    {"level_id": 2, "type": "judgment", "content": "在 Animate CC 中，使用直接选择工具可以选择并编辑路径上的锚点。",
     "options": [], "answer": "true", "explanation": "直接选择工具（白色箭头）专门用于选择和编辑路径上的锚点。", "knowledge_points": "选择工具"},
    # Level 3
    {"level_id": 3, "type": "single", "content": "创建形状补间动画时，起始帧和结束帧上的对象必须是什么？",
     "options": [{"label": "A", "text": "元件实例"}, {"label": "B", "text": "可编辑的形状"}, {"label": "C", "text": "组合对象"}, {"label": "D", "text": "位图"}],
     "answer": "B", "explanation": "形状补间要求对象必须是可编辑的形状。", "knowledge_points": "形状补间"},
    {"level_id": 3, "type": "judgment", "content": "缓动(Easing)功能可以让动画的变化速度不均匀，实现加速或减速效果。",
     "options": [], "answer": "true", "explanation": "缓动功能通过调整速度曲线实现自然的加速减速效果。", "knowledge_points": "动画编辑器"},
    # Level 4
    {"level_id": 4, "type": "single", "content": "按钮元件有几个状态帧？",
     "options": [{"label": "A", "text": "2个"}, {"label": "B", "text": "3个"}, {"label": "C", "text": "4个"}, {"label": "D", "text": "5个"}],
     "answer": "C", "explanation": "按钮元件有4个状态帧：弹起、经过、按下、点击区。", "knowledge_points": "按钮状态"},
    {"level_id": 4, "type": "judgment", "content": "同一个元件可以创建多个实例，每个实例可以有不同的属性。",
     "options": [], "answer": "true", "explanation": "这是元件的重要特性。", "knowledge_points": "实例属性"},
    # Level 5
    {"level_id": 5, "type": "single", "content": "骨骼工具(IK工具)主要用于创建什么类型的动画？",
     "options": [{"label": "A", "text": "形状变形动画"}, {"label": "B", "text": "反向运动学(IK)动画"}, {"label": "C", "text": "路径引导动画"}, {"label": "D", "text": "遮罩动画"}],
     "answer": "B", "explanation": "骨骼工具用于创建反向运动学(IK)动画。", "knowledge_points": "IK骨骼"},
    {"level_id": 5, "type": "judgment", "content": "在 Animate CC 中，可以将外部音频文件导入并同步到时间轴上。",
     "options": [], "answer": "true", "explanation": "支持导入音频文件并设置同步方式与时间轴配合。", "knowledge_points": "音频同步"},
]

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(Level))
        if result.scalars().first():
            print("Database already seeded")
            return

        for level_data in LEVELS:
            level = Level(**level_data)
            session.add(level)

        for q_data in QUESTIONS:
            question = Question(
                id=str(uuid.uuid4()),
                level_id=q_data["level_id"],
                type=q_data["type"],
                content=q_data["content"],
                options_json=json.dumps(q_data["options"]),
                answer=q_data["answer"],
                explanation=q_data["explanation"],
                knowledge_points=q_data["knowledge_points"],
            )
            session.add(question)

        await session.commit()
        print(f"Seeded {len(LEVELS)} levels and {len(QUESTIONS)} questions")

if __name__ == "__main__":
    asyncio.run(seed())
