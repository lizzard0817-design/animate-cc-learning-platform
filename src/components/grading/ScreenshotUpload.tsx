import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Image, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScreenshotUploadProps {
  file: File | null
  preview: string | null
  onUpload: (file: File) => void
}

export function ScreenshotUpload({ file, preview, onUpload }: ScreenshotUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onUpload(droppedFile)
    }
  }, [onUpload])

  const handleFileSelect = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }, [onUpload])

  const handleRemove = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  if (preview) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              已上传截图
            </span>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
          <CardDescription>{file?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={preview}
              alt="Screenshot preview"
              className="w-full h-auto max-h-[400px] object-contain bg-surface-1"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="w-5 h-5 text-primary" />
          上传截图
        </CardTitle>
        <CardDescription>
          拖拽或点击上传 Flash/Animate CC 作品截图
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-lg transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">
            拖拽图片到这里，或点击上传
          </p>
          <p className="text-xs text-muted-foreground">
            支持 PNG、JPG 格式
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </CardContent>
    </Card>
  )
}
