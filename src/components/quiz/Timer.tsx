import { useState, useEffect } from 'react'
import { Timer as TimerIcon } from 'lucide-react'

interface TimerProps {
  startTime: number
}

export function Timer({ startTime }: TimerProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <TimerIcon className="w-4 h-4" />
      <span className="text-sm font-mono">
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  )
}
