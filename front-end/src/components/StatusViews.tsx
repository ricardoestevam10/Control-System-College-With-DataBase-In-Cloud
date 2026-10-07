import type { ReactNode } from 'react'
import { Loader2, WifiOff, RefreshCw } from 'lucide-react'

export function Loading({ text = 'Carregando…' }: { text?: string }) {
  return (
    <div className="state">
      <Loader2 className="spin" size={28} />
      <p>{text}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state">
      <WifiOff size={32} />
      <p>{message}</p>
      <button className="btn btn-outline" onClick={onRetry}>
        <RefreshCw size={18} /> Tentar de novo
      </button>
    </div>
  )
}

export function Empty({ icon, title, hint, action }: { icon: ReactNode; title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="state">
      <span className="state-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{hint}</p>
      {action}
    </div>
  )
}
