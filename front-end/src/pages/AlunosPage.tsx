import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { GraduationCap, Plus, Search, User, Hash, School, DoorOpen, Save, Laptop, UserPlus, Pencil, Trash2 } from 'lucide-react'
import { listarAlunos, criarAluno, atualizarAluno, excluirAluno } from '../api/alunos'
import { listarNotebooks } from '../api/notebooks'
import type { Aluno, Notebook } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast, { type ToastData } from '../components/Toast'
import { Loading, ErrorState, Empty } from '../components/StatusViews'

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [toast, setToast] = useState<ToastData | null>(null)

  const [form, setForm] = useState<{ open: boolean; editing: Aluno | null }>({ open: false, editing: null })
  const [nome, setNome] = useState('')
  const [ra, setRa] = useState('')
  const [ano, setAno] = useState('')
  const [sala, setSala] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [toDelete, setToDelete] = useState<Aluno | null>(null)
  const [deleting, setDeleting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [a, n] = await Promise.all([listarAlunos(), listarNotebooks()])
      setAlunos(a)
      setNotebooks(n)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const notebookPorAluno = useMemo(() => {
    const map = new Map<string, number[]>()
    notebooks.forEach((n) => {
      if (!n.aluno) return
      map.set(n.aluno._id, [...(map.get(n.aluno._id) ?? []), n.numero])
    })
    return map
  }, [notebooks])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return alunos
    return alunos.filter((a) => a.nome.toLowerCase().includes(q) || String(a.RA ?? '').includes(q))
  }, [alunos, busca])

  function abrirNovo() {
    setForm({ open: true, editing: null })
    setNome('')
    setRa('')
    setAno('')
    setSala('')
    setFormError(null)
  }

  function abrirEditar(a: Aluno) {
    setForm({ open: true, editing: a })
    setNome(a.nome)
    setRa(a.RA ? String(a.RA) : '')
    setAno(a.ano)
    setSala(a.sala)
    setFormError(null)
  }

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return setFormError('Informe o nome do aluno.')
    if (!ano.trim()) return setFormError('Informe o ano (por exemplo, 2º ano).')
    if (!sala.trim()) return setFormError('Informe a sala.')
    if (ra && Number.isNaN(Number(ra))) return setFormError('O RA deve conter apenas números.')

    setSaving(true)
    setFormError(null)
    try {
      const dadosAluno = {
        nome: nome.trim(),
        RA: ra ? Number(ra) : undefined,
        ano: ano.trim(),
        sala: sala.trim(),
      }

      if (form.editing) {
        await atualizarAluno(form.editing._id, dadosAluno)
      } else {
        await criarAluno(dadosAluno)
      }

      setForm({ open: false, editing: null })
      setToast({ kind: 'ok', text: form.editing ? 'Aluno atualizado.' : 'Aluno cadastrado.' })
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
      await excluirAluno(toDelete._id)
      setToDelete(null)
      setToast({ kind: 'ok', text: 'Aluno excluído.' })
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
          <h1>Alunos</h1>
          <p className="muted">Cadastre os alunos que podem receber um notebook.</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo} disabled={loading || !!error}>
          <UserPlus size={18} /> Novo aluno
        </button>
      </header>

      {loading && <Loading />}
      {!loading && error && <ErrorState message={error} onRetry={carregar} />}

      {!loading && !error && (
        <>
          <div className="search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por nome ou RA"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar alunos"
            />
          </div>

          {alunos.length === 0 ? (
            <Empty
              icon={<GraduationCap size={32} />}
              title="Nenhum aluno cadastrado"
              hint="Cadastre um aluno para poder atribuir um notebook a ele."
              action={
                <button className="btn btn-primary" onClick={abrirNovo}>
                  <Plus size={18} /> Novo aluno
                </button>
              }
            />
          ) : filtrados.length === 0 ? (
            <Empty icon={<Search size={32} />} title="Nada encontrado" hint="Tente buscar por outro nome ou RA." />
          ) : (
            <ul className="list">
              {filtrados.map((a) => {
                const nums = notebookPorAluno.get(a._id)
                return (
                  <li key={a._id} className="row">
                    <span className="avatar"><User size={20} /></span>
                    <div className="row-main">
                      <strong>{a.nome}</strong>
                      <span className="muted">
                        <School size={14} /> {a.ano} · <DoorOpen size={14} /> sala {a.sala}
                        {a.RA ? <> · <Hash size={14} /> RA {a.RA}</> : null}
                      </span>
                    </div>

                    {nums ? (
                      <span className="tag tag-on"><Laptop size={14} /> Notebook {nums.join(', ')}</span>
                    ) : (
                      <span className="tag">Sem notebook</span>
                    )}

                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => abrirEditar(a)} aria-label={`Editar aluno ${a.nome}`}>
                        <Pencil size={18} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => setToDelete(a)}
                        aria-label={`Excluir aluno ${a.nome}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      {form.open && (
        <Modal
          title={form.editing ? 'Editar aluno' : 'Novo aluno'}
          icon={<UserPlus size={20} />}
          onClose={() => setForm({ open: false, editing: null })}
        >
          <form onSubmit={salvar} noValidate>
            <label className="field">
              <span><User size={16} /> Nome completo</span>
              <input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
            </label>
            <label className="field">
              <span><Hash size={16} /> RA (opcional)</span>
              <input inputMode="numeric" value={ra} onChange={(e) => setRa(e.target.value)} />
            </label>
            <div className="field-row">
              <label className="field">
                <span><School size={16} /> Ano</span>
                <input placeholder="2º ano" value={ano} onChange={(e) => setAno(e.target.value)} />
              </label>
              <label className="field">
                <span><DoorOpen size={16} /> Sala</span>
                <input placeholder="B" value={sala} onChange={(e) => setSala(e.target.value)} />
              </label>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <footer className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setForm({ open: false, editing: null })}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={18} /> {saving ? 'Salvando…' : 'Salvar aluno'}
              </button>
            </footer>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Excluir aluno"
          message={`Excluir o aluno ${toDelete.nome}? Essa ação não pode ser desfeita.`}
          busy={deleting}
          onConfirm={excluir}
          onCancel={() => setToDelete(null)}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}