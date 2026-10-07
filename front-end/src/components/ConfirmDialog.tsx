import { Trash2 } from 'lucide-react'
import Modal from './Modal'

interface Props {
  title: string
  message: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, busy, onConfirm, onCancel }: Props) {
  return (
    <Modal title={title} icon={<Trash2 size={20} />} onClose={onCancel}>
      <p className="modal-text">{message}</p>
      <footer className="modal-footer">
        <button className="btn btn-outline" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={onConfirm} disabled={busy}>
          <Trash2 size={18} /> {busy ? 'Excluindo…' : 'Excluir'}
        </button>
      </footer>
    </Modal>
  )
}
