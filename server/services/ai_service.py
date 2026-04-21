import json
import random
from typing import List, Dict

AI_MODE = "mock"  # Change to "api" for real AI integration

class CriterionResult:
    def __init__(self, name: str, max_score: int, score: int, status: str, feedback: str):
        self.name = name
        self.max_score = max_score
        self.score = score
        self.status = status
        self.feedback = feedback

PASSED_FEEDBACKS = [
    "表现优秀，各项要求均已满足。",
    "完成度很高，符合评分标准。",
    "该方面表现突出，值得肯定。",
]
PARTIAL_FEEDBACKS = [
    "基本达标，但存在部分不足，建议进一步完善。",
    "有一定基础，但仍需改进以达到标准要求。",
]
FAILED_FEEDBACKS = [
    "未达到要求，建议对照标准重新审视。",
    "该方面存在明显不足，需要重点改进。",
]

def generate_mock_results(criteria: List[Dict]) -> List[Dict]:
    results = []
    for criterion in criteria:
        random_val = random.random()
        if random_val < 0.15:
            status = "failed"
            score_ratio = 0.2 + random.random() * 0.3
            feedback = random.choice(FAILED_FEEDBACKS)
        elif random_val < 0.40:
            status = "partial"
            score_ratio = 0.5 + random.random() * 0.25
            feedback = random.choice(PARTIAL_FEEDBACKS)
        else:
            status = "passed"
            score_ratio = 0.75 + random.random() * 0.25
            feedback = random.choice(PASSED_FEEDBACKS)

        score = round(criterion["max_score"] * score_ratio)
        results.append({
            "name": criterion["name"],
            "max_score": criterion["max_score"],
            "score": score,
            "status": status,
            "feedback": f"{criterion['description']}\n\n{feedback}",
        })
    return results

def calculate_grade(total_score: int, max_score: int) -> str:
    percentage = (total_score / max_score) * 100
    if percentage >= 95: return "S"
    if percentage >= 80: return "A"
    if percentage >= 60: return "B"
    if percentage >= 40: return "C"
    return "D"

def generate_overall_feedback(total_score: int, max_score: int) -> str:
    percentage = (total_score / max_score) * 100
    if percentage >= 90:
        return "作品整体表现优异，各维度均达到较高水准。"
    elif percentage >= 75:
        return "作品整体表现良好，部分维度仍有提升空间。"
    elif percentage >= 60:
        return "作品基本达标，但存在明显不足，建议针对性改进。"
    else:
        return "作品未达到基本要求，建议对照评分标准逐项完善。"

def generate_questions(level_id: int, knowledge_points: List[str], count: int = 3) -> List[Dict]:
    templates = [
        {
            "type": "single",
            "template": "在Animate CC中，关于{point}的描述，以下说法正确的是？",
            "options": [
                {"label": "A", "text": f"{point}是Animate CC的重要功能"},
                {"label": "B", "text": f"与{point}无关的功能"},
                {"label": "C", "text": f"错误的{point}描述"},
                {"label": "D", "text": f"过时的{point}概念"},
            ],
            "answer": "A",
            "explanation": f"{point}是Animate CC的核心功能之一，掌握它可以提高工作效率。",
        },
        {
            "type": "multiple",
            "template": "以下哪些与{point}相关？（多选）",
            "options": [
                {"label": "A", "text": f"{point}功能1"},
                {"label": "B", "text": f"{point}功能2"},
                {"label": "C", "text": "不相关功能"},
                {"label": "D", "text": f"{point}功能3"},
            ],
            "answer": "ABD",
            "explanation": f"{point}包含多个方面的知识点。",
        },
        {
            "type": "judgment",
            "template": f"在Animate CC中，{knowledge_points[0]}是默认开启的功能。",
            "options": [],
            "answer": "true",
            "explanation": f"{knowledge_points[0]}是标准功能。",
        },
    ]

    questions = []
    for i in range(min(count, len(templates))):
        template = templates[i]
        point = knowledge_points[i % len(knowledge_points)]
        content = template["template"].replace("{point}", point)
        explanation = template["explanation"].replace("{point}", point)
        options = [
            {**opt, "text": opt["text"].replace("{point}", point)}
            for opt in template["options"]
        ] if template["options"] else []

        questions.append({
            "type": template["type"],
            "content": content,
            "options": options,
            "answer": template["answer"],
            "explanation": explanation,
            "knowledge_points": [point],
        })

    return questions
