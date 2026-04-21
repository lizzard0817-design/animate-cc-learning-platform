import type { Level } from '@/types'

export const LEVEL_CONFIG: Level[] = [
  {
    id: 1,
    name: "初识 Animate",
    description: "了解 Animate CC 的基本界面、工具面板和基础操作",
    difficulty: "beginner",
    icon: "🏰",
    color: "level-1",
    knowledge_points: [
      "Animate CC 界面布局",
      "工具面板的功能与使用",
      "舞台(Stage)与工作区",
      "时间轴(Timeline)基本概念",
      "文档新建与属性设置",
    ],
    unlock_required_score: 0,
  },
  {
    id: 2,
    name: "绘图工具",
    description: "掌握各种绘图工具的使用方法和矢量图形编辑技巧",
    difficulty: "elementary",
    icon: "🎨",
    color: "level-2",
    knowledge_points: [
      "选择工具与直接选择工具",
      "钢笔工具与路径编辑",
      "形状工具（矩形、椭圆、多边形）",
      "画笔工具与线条工具",
      "填充与描边设置",
      "对象的对齐与分布",
    ],
    unlock_required_score: 60,
  },
  {
    id: 3,
    name: "动画制作",
    description: "学习关键帧动画、补间动画和动画预设的使用",
    difficulty: "intermediate",
    icon: "🎬",
    color: "level-3",
    knowledge_points: [
      "关键帧与普通帧",
      "形状补间动画(Shape Tween)",
      "动画补间动画(Motion Tween)",
      "传统补间动画(Classic Tween)",
      "动画编辑器与缓动",
      "引导层动画",
      "遮罩层动画",
    ],
    unlock_required_score: 60,
  },
  {
    id: 4,
    name: "交互设计",
    description: "掌握元件、实例、按钮和ActionScript基础交互",
    difficulty: "advanced",
    icon: "🎮",
    color: "level-4",
    knowledge_points: [
      "元件(Symbol)的三种类型",
      "按钮元件的四个状态帧",
      "实例属性与元件编辑",
      "ActionScript 3.0 基础语法",
      "事件监听与处理",
      "时间轴控制代码",
    ],
    unlock_required_score: 60,
  },
  {
    id: 5,
    name: "进阶技巧",
    description: "学习高级动画技术、音视频集成和发布导出",
    difficulty: "expert",
    icon: "🚀",
    color: "level-5",
    knowledge_points: [
      "骨骼工具与反向运动(IK)",
      "3D变换与透视",
      "音频导入与同步",
      "视频嵌入与组件",
      "发布设置与导出格式",
      "SWF与HTML5 Canvas发布",
      "性能优化技巧",
    ],
    unlock_required_score: 60,
  },
]

export function getLevelById(id: number): Level | undefined {
  return LEVEL_CONFIG.find(level => level.id === id)
}

export function getUnlockedLevels(bestScores: Record<number, number>): Level[] {
  return LEVEL_CONFIG.filter((level, index) => {
    if (index === 0) return true
    const prevLevel = LEVEL_CONFIG[index - 1]
    return (bestScores[prevLevel.id] ?? 0) >= level.unlock_required_score
  })
}
