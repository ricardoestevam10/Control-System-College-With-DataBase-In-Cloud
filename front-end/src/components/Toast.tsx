import { useEffect } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export interface ToastData {
  kind: 'ok' | 'erro'
  text: string
}

export default function Toast({ toast, onDone }: { toast: ToastData | null; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [toast, onDone])

  if (!toast) return null
  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      {toast.kind === 'ok' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span>{toast.text}</span>
    </div>
  )
}
