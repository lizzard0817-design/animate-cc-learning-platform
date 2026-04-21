import type { Criterion, GradingStep } from '@/types'

export interface RubricTemplate {
  id: string
  name: string
  description: string
  icon: string
  criteria: Criterion[]
}

// 从 /Volumes/Rog Strix/评价标准/ 三个 Excel 文件解析的评分标准
export const RUBRIC_TEMPLATES: RubricTemplate[] = [
  {
    id: 'scroll',
    name: '卷轴动画评价表',
    description: '平面动画设计任务单（遮罩动画-卷轴动画）',
    icon: '📜',
    criteria: [
      { name: '理解遮罩动画原理', max_score: 5, description: '理解遮罩层与被遮罩层的关系' },
      { name: '图层顺序正确', max_score: 5, description: '知道卷轴动画中图层顺序：背景、卷轴、遮罩层、被遮罩层' },
      { name: '补间动画适用场景', max_score: 5, description: '能区分传统补间（位移）与形状补间（遮罩变化）的适用场景' },
      { name: '掌握制作流程', max_score: 5, description: '掌握卷轴动画的制作流程（设计元件→布局→设置补间→调整同步）' },
      { name: '图层命名规范', max_score: 5, description: '正确创建并命名图层（左卷轴、右卷轴、遮罩层、被遮罩层、背景）' },
      { name: '元件使用规范', max_score: 5, description: '卷轴、诗词文字等转换为图形元件或影片剪辑' },
      { name: '补间动画设置', max_score: 8, description: '补间动画设置正确（左/右卷轴使用传统补间，遮罩层使用形状补间或传统补间+缩放）' },
      { name: '关键帧位置合理', max_score: 4, description: '时间轴关键帧位置合理，无多余帧或空白关键帧' },
      { name: '工程文件规范', max_score: 3, description: '工程文件（.fla）保存规范，元件库有分组或清晰命名' },
      { name: '卷轴位移动画', max_score: 8, description: '左卷轴和右卷轴位移动画流畅、对称，使用缓动效果' },
      { name: '遮罩层动画平滑', max_score: 8, description: '遮罩层动画（形状/大小变化）平滑，无锯齿或突变' },
      { name: '遮罩同步对齐', max_score: 12, description: '卷轴移动与遮罩扩展完全同步（视觉上卷轴边缘与文字显示边缘对齐）' },
      { name: '文字排版美观', max_score: 6, description: '诗词文字完整、清晰，排版美观（符合卷轴风格）' },
      { name: '动画完整播放', max_score: 6, description: '动画可完整播放，结束时自动停止，无回跳' },
      { name: '按时提交规范命名', max_score: 5, description: '按时提交作业，文件命名规范（学号+姓名+卷轴动画）' },
      { name: '备份源文件', max_score: 3, description: '备份源文件，避免因软件崩溃导致数据丢失' },
      { name: '课堂时间管理', max_score: 4, description: '课堂时间管理：合理规划制作步骤，不浪费课堂时间' },
      { name: '素材整理规范', max_score: 3, description: '主动整理素材，不随意堆放外部图片或元件' },
    ],
  },
  {
    id: 'paper-plane',
    name: '纸飞机引导动画评价表',
    description: '平面动画设计任务单（引导动画-纸飞机）',
    icon: '✈️',
    criteria: [
      { name: '理解引导动画原理', max_score: 5, description: '理解引导层与被引导层的关系' },
      { name: '图层顺序正确', max_score: 5, description: '知道引导动画中图层顺序：引导层在上，被引导层在下，背景在最下' },
      { name: '补间与引导结合', max_score: 5, description: '能区分传统补间（移动）与引导层动画的结合方式' },
      { name: '掌握制作流程', max_score: 5, description: '掌握引导动画的制作流程（绘制引导线→创建传统补间→吸附到路径→调整朝向）' },
      { name: '图层命名规范', max_score: 5, description: '正确创建并命名图层（引导层、被引导层（纸飞机）、背景层）' },
      { name: '引导线绘制规范', max_score: 6, description: '引导线绘制规范：使用铅笔或钢笔工具绘制连续、平滑的路径（无断点）' },
      { name: '元件转换正确', max_score: 6, description: '纸飞机元件正确转换为图形元件或影片剪辑，并设置传统补间' },
      { name: '关键帧吸附准确', max_score: 5, description: '关键帧位置合理：起始帧和结束帧的纸飞机中心点准确吸附在引导线两端' },
      { name: '工程文件规范', max_score: 3, description: '工程文件（.fla）保存规范，元件库命名清晰，无多余帧或空白关键帧' },
      { name: '引导线运动完整', max_score: 10, description: '纸飞机沿引导线运动轨迹完整，无偏离路径或跳跃' },
      { name: '运动流畅自然', max_score: 6, description: '纸飞机运动流畅，速度自然' },
      { name: '朝向与路径匹配', max_score: 10, description: '纸飞机朝向与路径方向匹配（飞机头始终指向运动方向）' },
      { name: '背景设计协调', max_score: 6, description: '背景设计合理（如天空、云朵等），与纸飞机风格协调' },
      { name: '动画完整播放', max_score: 8, description: '动画可完整播放，结束时自动停止，无回跳或画面错位' },
      { name: '按时提交规范命名', max_score: 5, description: '按时提交作业，文件命名规范（学号+姓名+纸飞机引导动画）' },
      { name: '备份源文件', max_score: 3, description: '备份源文件，避免因软件崩溃导致数据丢失' },
      { name: '课堂时间管理', max_score: 4, description: '课堂时间管理：合理规划制作步骤，不浪费课堂时间' },
      { name: '素材整理规范', max_score: 3, description: '主动整理素材，不随意堆放外部图片或元件' },
    ],
  },
  {
    id: 'timeline',
    name: '时间轴动画类型识别表',
    description: 'Animate CC 时间轴动画类型识别与评价',
    icon: '⏱️',
    criteria: [
      { name: '运动补间动画识别', max_score: 25, description: '连续的蓝色或紫色背景帧范围，可整体选中；起始关键帧为黑色圆点，后续属性关键帧为黑色菱形；Animate 主推的现代补间方式，一个图层只能应用于一个元件实例' },
      { name: '传统补间动画识别', max_score: 25, description: '帧之间带有黑色箭头，背景为淡紫色；起始和结束关键帧均为黑色圆点；若箭头变为虚线，表示补间中断或不完整（如两端不是同类型元件）' },
      { name: '形状补间动画识别', max_score: 25, description: '帧之间带有黑色箭头，背景为浅绿色；起始和结束关键帧均为黑色圆点；用于矢量图形的形状渐变，不能应用于元件或组合对象' },
      { name: '逐帧动画识别', max_score: 25, description: '每个帧都是独立的关键帧，背景为灰色；每个帧在黑色圆点；需要逐帧绘制内容，文件体积通常较大，适合复杂动作' },
    ],
  },
]

export function getRubricTemplate(id: string): RubricTemplate | undefined {
  return RUBRIC_TEMPLATES.find(t => t.id === id)
}

export function rubricToText(criteria: Criterion[]): string {
  return criteria.map(c => `${c.name} | ${c.max_score} | ${c.description}`).join('\n')
}

export function parseRubric(text: string): Criterion[] {
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split('|').map(p => p.trim())
      if (parts.length >= 2) {
        return {
          name: parts[0],
          max_score: parseInt(parts[1]) || 0,
          description: parts[2] || '',
        }
      }
      return null
    })
    .filter((c): c is Criterion => c !== null)
}

export const GRADING_STEPS: Omit<GradingStep, 'status' | 'progress'>[] = [
  {
    id: 'parse-rubric',
    label: '解析评分标准',
    description: '分析评分标准结构',
  },
  {
    id: 'analyze-screenshot',
    label: '识别截图内容',
    description: 'AI识别作品截图中的界面元素',
  },
  {
    id: 'evaluate-criteria',
    label: '逐项比对判定',
    description: '根据评分标准逐项给出判定结果',
  },
]

const PASSED_FEEDBACKS = [
  '表现优秀，各项要求均已满足。',
  '完成度很高，符合评分标准。',
  '该方面表现突出，值得肯定。',
]

const PARTIAL_FEEDBACKS = [
  '基本达标，但存在部分不足，建议进一步完善。',
  '有一定基础，但仍需改进以达到标准要求。',
  '部分满足要求，建议针对性加强薄弱环节。',
]

const FAILED_FEEDBACKS = [
  '未达到要求，建议对照标准重新审视。',
  '该方面存在明显不足，需要重点改进。',
  '未满足评分标准，建议参考示例作品重新设计。',
]

export function generateMockResults(criteria: Criterion[]) {
  return criteria.map((criterion) => {
    const random = Math.random()

    let status: 'passed' | 'partial' | 'failed'
    let scoreRatio: number
    let feedback: string

    if (random < 0.15) {
      status = 'failed'
      scoreRatio = 0.2 + Math.random() * 0.3
      feedback = FAILED_FEEDBACKS[Math.floor(Math.random() * FAILED_FEEDBACKS.length)]
    } else if (random < 0.40) {
      status = 'partial'
      scoreRatio = 0.5 + Math.random() * 0.25
      feedback = PARTIAL_FEEDBACKS[Math.floor(Math.random() * PARTIAL_FEEDBACKS.length)]
    } else {
      status = 'passed'
      scoreRatio = 0.75 + Math.random() * 0.25
      feedback = PASSED_FEEDBACKS[Math.floor(Math.random() * PASSED_FEEDBACKS.length)]
    }

    const score = Math.round(criterion.max_score * scoreRatio)

    return {
      name: criterion.name,
      max_score: criterion.max_score,
      score,
      status,
      feedback: `${criterion.description}\n\n${feedback}`,
    }
  })
}

export function generateOverallFeedback(totalScore: number, maxScore: number): string {
  const percentage = (totalScore / maxScore) * 100

  if (percentage >= 90) {
    return '作品整体表现优异，各维度均达到较高水准。继续保持，你已经成为一名优秀的 Animate CC 设计师！'
  } else if (percentage >= 75) {
    return '作品整体表现良好，部分维度仍有提升空间。建议查看各项判定反馈，针对性地改进薄弱环节。'
  } else if (percentage >= 60) {
    return '作品基本达标，但存在明显不足。建议对照评分标准，逐项完善不足之处后重新提交。'
  } else {
    return '作品未达到基本要求。建议参考示例作品和评分标准，重新设计后再次提交批改。'
  }
}

export function calculateGrade(totalScore: number, maxScore: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  const percentage = (totalScore / maxScore) * 100
  if (percentage >= 95) return 'S'
  if (percentage >= 80) return 'A'
  if (percentage >= 60) return 'B'
  if (percentage >= 40) return 'C'
  return 'D'
}
