import { useState } from 'react'
import { useQuestionBank } from '@/hooks/useQuestionBank'
import { useAIGenerate } from '@/hooks/useAIGenerate'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { ArrowLeft, Plus, Edit, Trash2, Sparkles, RotateCcw, Search } from 'lucide-react'
import type { Question, QuestionType, Toast } from '@/types'
import { LEVEL_CONFIG } from '@/data/levelConfig'

interface AdminPageProps {
  onBack: () => void
  addToast: (message: string, type: Toast['type']) => void
}

export function AdminPage({ onBack, addToast }: AdminPageProps) {
  const {
    questions,
    stats,
    editingQuestion,
    filterLevel,
    setFilterLevel,
    searchQuery,
    setSearchQuery,
    setEditingQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetBank,
  } = useQuestionBank()

  const { generateQuestions } = useAIGenerate()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Question>>({
    level_id: 1,
    type: 'single',
    content: '',
    options: [
      { label: 'A', text: '' },
      { label: 'B', text: '' },
      { label: 'C', text: '' },
      { label: 'D', text: '' },
    ],
    answer: '',
    explanation: '',
    knowledge_points: [],
  })
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleAddQuestion = () => {
    if (!formData.content || !formData.answer) {
      addToast('请填写题目内容和答案', 'warning')
      return
    }
    addQuestion({
      level_id: formData.level_id as 1 | 2 | 3 | 4 | 5,
      type: formData.type as QuestionType,
      content: formData.content || '',
      options: formData.options || [],
      answer: formData.answer || '',
      explanation: formData.explanation || '',
      knowledge_points: formData.knowledge_points || [],
      is_ai_generated: false,
    })
    setShowForm(false)
    setFormData({
      level_id: 1,
      type: 'single',
      content: '',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' },
      ],
      answer: '',
      explanation: '',
      knowledge_points: [],
    })
    addToast('题目添加成功', 'success')
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setFormData(question)
    setShowForm(true)
  }

  const handleSaveEdit = () => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, {
        level_id: formData.level_id as 1 | 2 | 3 | 4 | 5,
        type: formData.type as QuestionType,
        content: formData.content || '',
        options: formData.options || [],
        answer: formData.answer || '',
        explanation: formData.explanation || '',
        knowledge_points: formData.knowledge_points || [],
      })
      addToast('题目更新成功', 'success')
    }
  }

  const handleDelete = (id: string) => {
    deleteQuestion(id)
    addToast('题目已删除', 'info')
  }

  const handleAIGenerate = (levelId: number) => {
    const newQuestions = generateQuestions(levelId, 3)
    newQuestions.forEach(q => addQuestion(q))
    addToast(`已为关卡${levelId}生成${newQuestions.length}道题目`, 'success')
  }

  const handleReset = () => {
    resetBank()
    setShowResetDialog(false)
    addToast('题库已重置为默认25题', 'info')
  }

  const levelOptions = [
    { value: '0', label: '全部关卡' },
    ...LEVEL_CONFIG.map(l => ({ value: String(l.id), label: l.name })),
  ]

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold text-foreground">题库管理</h1>
          <Button variant="destructive" onClick={() => setShowResetDialog(true)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置题库
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">总题目数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.level_count}</p>
                <p className="text-sm text-muted-foreground">关卡数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.ai_generated_count}</p>
                <p className="text-sm text-muted-foreground">AI生成</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{LEVEL_CONFIG.length}</p>
                <p className="text-sm text-muted-foreground">知识模块</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索题目..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            options={levelOptions}
            value={String(filterLevel)}
            onChange={e => setFilterLevel(Number(e.target.value))}
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加题目
          </Button>
        </div>

        <div className="space-y-3">
          {questions.map(question => (
            <Card key={question.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {LEVEL_CONFIG.find(l => l.id === question.level_id)?.name}
                      </Badge>
                      <Badge variant={question.type === 'single' ? 'default' : question.type === 'multiple' ? 'warning' : 'success'}>
                        {question.type === 'single' ? '单选' : question.type === 'multiple' ? '多选' : '判断'}
                      </Badge>
                      {question.is_ai_generated && (
                        <Badge variant="outline">AI生成</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{question.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">答案：{question.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(question)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(question.id)}>
                      <Trash2 className="w-4 h-4 text-status-failed" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI生成题目
            </CardTitle>
            <CardDescription>
              选择关卡后点击按钮，自动生成3道新题目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {LEVEL_CONFIG.map(level => (
                <Button
                  key={level.id}
                  variant="outline"
                  onClick={() => handleAIGenerate(level.id)}
                >
                  {level.icon} {level.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm} title={editingQuestion ? '编辑题目' : '添加题目'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">关卡</label>
            <Select
              options={LEVEL_CONFIG.map(l => ({ value: String(l.id), label: l.name }))}
              value={String(formData.level_id || 1)}
              onChange={e => setFormData(prev => ({ ...prev, level_id: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">题型</label>
            <Select
              options={[
                { value: 'single', label: '单选题' },
                { value: 'multiple', label: '多选题' },
                { value: 'judgment', label: '判断题' },
              ]}
              value={formData.type || 'single'}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as QuestionType }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">题目内容</label>
            <Textarea
              value={formData.content || ''}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
            />
          </div>
          {formData.type !== 'judgment' && (
            <div>
              <label className="text-sm font-medium mb-1 block">选项</label>
              <div className="space-y-2">
                {formData.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-bold w-6">{opt.label}.</span>
                    <Input
                      value={opt.text}
                      onChange={e => {
                        const newOpts = [...(formData.options || [])]
                        newOpts[i] = { ...newOpts[i], text: e.target.value }
                        setFormData(prev => ({ ...prev, options: newOpts }))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">答案</label>
            <Input
              value={formData.answer || ''}
              onChange={e => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="单选填A/B/C/D，多选填ABC等，判断填true/false"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">解析</label>
            <Textarea
              value={formData.explanation || ''}
              onChange={e => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
          <Button onClick={editingQuestion ? handleSaveEdit : handleAddQuestion}>
            {editingQuestion ? '保存' : '添加'}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="确认重置"
        description="这将删除所有自定义题目，恢复为默认25题"
      >
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowResetDialog(false)}>取消</Button>
          <Button variant="destructive" onClick={handleReset}>确认重置</Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
