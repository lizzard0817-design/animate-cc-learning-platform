import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  message: string
  type?: "success" | "error" | "info" | "warning"
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, message, type = "info", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const bgColor = {
    success: "bg-status-passed",
    error: "bg-status-failed",
    info: "bg-primary",
    warning: "bg-status-partial",
  }[type]

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg", bgColor)}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => onClose(id)} className="ml-auto text-white/80 hover:text-white">
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
