import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Laptop, Plus, Search, Pencil, Trash2, User, Hash, Save, GraduationCap, School } from 'lucide-react'
import { listarNotebooks, criarNotebook, atualizarNotebook, excluirNotebook } from '../api/notebooks'
import { listarAlunos } from '../api/alunos'
import type { Aluno, Notebook } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast, { type ToastData } from '../components/Toast'
import { Loading, ErrorState, Empty } from '../components/StatusViews'

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [toast, setToast] = useState<ToastData | null>(null)

  const [form, setForm] = useState<{ open: boolean; editing: Notebook | null }>({ open: false, editing: null })
  const [numero, setNumero] = useState('')
  const [alunoId, setAlunoId] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [toDelete, setToDelete] = useState<Notebook | null>(null)
  const [deleting, setDeleting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [n, a] = await Promise.all([listarNotebooks(), listarAlunos()])
      setNotebooks(n)
      setAlunos(a)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return notebooks
    return notebooks.filter(
      (n) => String(n.numero).includes(q) || (n.aluno?.nome ?? '').toLowerCase().includes(q),
    )
  }, [notebooks, busca])

  function abrirNovo() {
    setForm({ open: true, editing: null })
    setNumero('')
    setAlunoId('')
    setFormError(null)
  }

  function abrirEditar(n: Notebook) {
    setForm({ open: true, editing: n })
    setNumero(String(n.numero))
    setAlunoId(n.aluno?._id ?? '')
    setFormError(null)
  }

  async function salvar(e: FormEvent) {
    e.preventDefault()
    const num = Number(numero)
    if (!numero || Number.isNaN(num) || num <= 0) return setFormError('Informe o número do notebook.')
    if (!alunoId) return setFormError('Escolha o aluno responsável.')

    setSaving(true)
    setFormError(null)
    try {
      if (form.editing) {
        await atualizarNotebook(form.editing._id, { numero: num, aluno: alunoId })
      } else {
        await criarNotebook({ numero: num, aluno: alunoId })
      }
      setForm({ open: false, editing: null })
      setToast({ kind: 'ok', text: form.editing ? 'Notebook atualizado.' : 'Notebook cadastrado.' })
      await carregar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setSaving(false)
    }
  }

  async function excluir() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await excluirNotebook(toDelete._id)
      setToDelete(null)
      setToast({ kind: 'ok', text: 'Notebook excluído.' })
      await carregar()
    } catch (err) {
      setToDelete(null)
      setToast({ kind: 'erro', text: err instanceof Error ? err.message : 'Erro inesperado.' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Notebooks</h1>
          <p className="muted">Veja qual aluno está com cada notebook.</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo} disabled={loading || !!error}>
          <Plus size={18} /> Novo notebook
        </button>
      </header>

      {loading && <Loading />}
      {!loading && error && <ErrorState message={error} onRetry={carregar} />}

      {!loading && !error && (
        <>
          <div className="stats">
            <div className="stat">
              <span className="stat-icon"><Laptop size={22} /></span>
              <div>
                <strong>{notebooks.length}</strong>
                <span>notebooks emprestados</span>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon"><GraduationCap size={22} /></span>
              <div>
                <strong>{alunos.length}</strong>
                <span>alunos cadastrados</span>
              </div>
            </div>
          </div>

          <div className="search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por número ou nome do aluno"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar notebooks"
            />
          </div>

          {notebooks.length === 0 ? (
            <Empty
              icon={<Laptop size={32} />}
              title="Nenhum notebook cadastrado"
              hint="Cadastre o primeiro notebook e escolha o aluno responsável."
              action={
                <button className="btn btn-primary" onClick={abrirNovo}>
                  <Plus size={18} /> Novo notebook
                </button>
              }
            />
          ) : filtrados.length === 0 ? (
            <Empty icon={<Search size={32} />} title="Nada encontrado" hint="Tente buscar por outro número ou nome." />
          ) : (
            <ul className="list">
              {filtrados.map((n) => (
                <li key={n._id} className="row">
                  <span className="badge-num">
                    <Hash size={14} />
                    {n.numero}
                  </span>
                  <div className="row-main">
                    <strong>
                      <User size={16} /> {n.aluno?.nome ?? 'Aluno removido'}
                    </strong>
                    {n.aluno && (
                      <span className="muted">
                        <School size={14} /> {n.aluno.ano} · sala {n.aluno.sala}
                        {n.aluno.RA ? ` · RA ${n.aluno.RA}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="row-actions">
                    <button className="icon-btn" onClick={() => abrirEditar(n)} aria-label={`Editar notebook ${n.numero}`}>
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => setToDelete(n)}
                      aria-label={`Excluir notebook ${n.numero}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {form.open && (
        <Modal
          title={form.editing ? 'Editar notebook' : 'Novo notebook'}
          icon={<Laptop size={20} />}
          onClose={() => setForm({ open: false, editing: null })}
        >
          <form onSubmit={salvar} noValidate>
            <label className="field">
              <span><Hash size={16} /> Número do notebook</span>
              <input type="number" min={1} value={numero} onChange={(e) => setNumero(e.target.value)} autoFocus />
            </label>
            <label className="field">
              <span><User size={16} /> Aluno responsável</span>
              <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
                <option value="">Escolha um aluno</option>
                {alunos.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.nome} — {a.ano} {a.sala}
                  </option>
                ))}
              </select>
            </label>
            {alunos.length === 0 && (
              <p className="hint">Nenhum aluno cadastrado ainda. Cadastre um na aba Alunos.</p>
            )}
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <footer className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setForm({ open: false, editing: null })}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={18} /> {saving ? 'Salvando…' : 'Salvar notebook'}
              </button>
            </footer>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Excluir notebook"
          message={`Excluir o notebook ${toDelete.numero}${toDelete.aluno ? ` de ${toDelete.aluno.nome}` : ''}? Essa ação não pode ser desfeita.`}
          busy={deleting}
          onConfirm={excluir}
          onCancel={() => setToDelete(null)}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}
