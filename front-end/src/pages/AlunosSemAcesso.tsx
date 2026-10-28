import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { GraduationCap, Plus, Search, User, Hash, School, DoorOpen, Save, Pencil, Trash2, CheckSquare, Square } from 'lucide-react'
import type { FormEvent } from 'react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast, { type ToastData } from '../components/Toast'
import { Loading, ErrorState, Empty } from '../components/StatusViews'

interface Aluno {
  _id: string;
  nome: string;
  RA?: number;
  sala: string;
  ano: string;
  atividadeEntregue: boolean;
  temAcesso: boolean;
}

export default function AlunosSemAcesso() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [busca, setBusca] = useState('')
  const [anoSelecionado, setAnoSelecionado] = useState('')
  const [toast, setToast] = useState<ToastData | null>(null)

  const [form, setForm] = useState<{ open: boolean; editing: Aluno | null }>({ open: false, editing: null })
  const [nome, setNome] = useState('')
  const [ra, setRa] = useState('')
  const [sala, setSala] = useState('')
  const [ano, setAno] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [toDelete, setToDelete] = useState<Aluno | null>(null)
  const [deleting, setDeleting] = useState(false)

  const buscarAlunos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8080/alunos')
      if (!res.ok) throw new Error('Erro ao buscar a lista de alunos do servidor.')
      const data = await res.json()
      setAlunos(data.alunos || data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarAlunos()
  }, [buscarAlunos])

  const anosDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        alunos
          .filter((aluno) => aluno.temAcesso === false)
          .map((aluno) => aluno.ano)
      )
    ).sort()
  }, [alunos])

  const alunosFiltrados = useMemo(() => {
    return alunos
      .filter((aluno) => aluno.temAcesso === false)
      .filter((aluno) => {
        if (anoSelecionado !== '' && aluno.ano !== anoSelecionado) {
          return false
        }

        const q = busca.trim().toLowerCase()
        if (!q) return true

        return (
          aluno.nome.toLowerCase().includes(q) ||
          aluno.sala.toLowerCase().includes(q) ||
          String(aluno.RA ?? '').includes(q)
        )
      })
  }, [alunos, busca, anoSelecionado])

  function abrirNovo() {
    setForm({ open: true, editing: null })
    setNome('')
    setRa('')
    setAno('')
    setSala('')
    setFormError(null)
  }

  function abrirEditar(aluno: Aluno) {
    setForm({ open: true, editing: aluno })
    setNome(aluno.nome)
    setRa(aluno.RA ? String(aluno.RA) : '')
    setSala(aluno.sala)
    setAno(aluno.ano)
    setFormError(null)
  }

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return setFormError('Informe o nome do aluno.')
    if (!ano.trim()) return setFormError('Informe o ano letivo.')
    if (!sala.trim()) return setFormError('Informe a sala.')
    if (ra && Number.isNaN(Number(ra))) return setFormError('O RA deve conter apenas números.')

    setSaving(true)
    setFormError(null)
    try {
      const dadosAluno = {
        nome: nome.trim(),
        RA: ra ? Number(ra) : undefined,
        sala: sala.trim(),
        ano: ano.trim(),
        temAcesso: false
      }

      const url = form.editing 
        ? `http://localhost:8080/aluno/${form.editing._id}` 
        : 'http://localhost:8080/aluno'
      
      const response = await fetch(url, {
        method: form.editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAluno)
      })

      if (!response.ok) throw new Error('Não foi possível salvar as alterações no servidor.')

      setForm({ open: false, editing: null })
      setToast({ kind: 'ok', text: form.editing ? 'Aluno atualizado.' : 'Aluno cadastrado.' })
      await buscarAlunos()
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
      const response = await fetch(`http://localhost:8080/aluno/${toDelete._id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao tentar remover o registro.')

      setToDelete(null)
      setToast({ kind: 'ok', text: 'Aluno excluído.' })
      await buscarAlunos()
    } catch (err) {
      setToDelete(null)
      setToast({ kind: 'erro', text: err instanceof Error ? err.message : 'Erro inesperado.' })
    } finally {
      setDeleting(false)
    }
  }

  async function handleCheckboxChange(aluno: Aluno) {
    const novoStatus = !aluno.atividadeEntregue

    setAlunos((prevAlunos) =>
      prevAlunos.map((a) =>
        a._id === aluno._id ? { ...a, atividadeEntregue: novoStatus } : a
      )
    )

    try {
      const response = await fetch(`http://localhost:8080/aluno/${aluno._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: aluno.nome,
          RA: aluno.RA,
          sala: aluno.sala,
          ano: aluno.ano,
          atividadeEntregue: novoStatus,
          temAcesso: aluno.temAcesso
        }),
      })

      if (!response.ok) throw new Error()
      setToast({ kind: 'ok', text: novoStatus ? 'Atividade marcada como entregue.' : 'Entrega desmarcada.' })
    } catch (error) {
      console.error(error)
      setToast({ kind: 'erro', text: 'Não foi possível salvar o status da atividade.' })
      buscarAlunos()
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Controle de Atividades</h1>
          <p className="muted">Gerencie as entregas e cadastros de alunos sem acesso.</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo} disabled={loading || !!error}>
          <Plus size={18} /> Novo aluno
        </button>
      </header>

      {loading && <Loading />}
      {!loading && error && <ErrorState message={error} onRetry={buscarAlunos} />}

      {!loading && !error && (
        <>
          <div className="search" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
              <Search size={18} />
              <input
                type="search"
                placeholder="Buscar por nome, sala ou RA"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar alunos"
                style={{ background: 'transparent', border: 'none', width: '100%', color: 'inherit', outline: 'none' }}
              />
            </div>
            
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              style={{
                background: 'var(--bg-card, #1e1e1e)',
                color: 'inherit',
                border: '1px solid var(--border-color, #333)',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              <option value="">Todos os anos</option>
              {anosDisponiveis.map((anoItem) => (
                <option key={anoItem} value={anoItem}>
                  Ano: {anoItem}
                </option>
              ))}
            </select>
          </div>

          {alunos.filter(a => !a.temAcesso).length === 0 ? (
            <Empty
              icon={<GraduationCap size={32} />}
              title="Nenhum aluno sem acesso"
              hint="Cadastre um aluno para poder gerenciar o controle de atividades manuais."
              action={
                <button className="btn btn-primary" onClick={abrirNovo}>
                  <Plus size={18} /> Novo aluno
                </button>
              }
            />
          ) : alunosFiltrados.length === 0 ? (
            <Empty icon={<Search size={32} />} title="Nada encontrado" hint="Tente buscar por outro termo ou ano letivo." />
          ) : (
            <ul className="list">
              {alunosFiltrados.map((aluno) => (
                <li key={aluno._id} className="row">
                  <span className="avatar"><User size={20} /></span>
                  <div className="row-main">
                    <strong>{aluno.nome}</strong>
                    <span className="muted">
                      <School size={14} /> {aluno.ano} · <DoorOpen size={14} /> sala {aluno.sala}
                      {aluno.RA ? <> · <Hash size={14} /> RA {aluno.RA}</> : null}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleCheckboxChange(aluno)}
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0, color: 'inherit' }}
                  >
                    {aluno.atividadeEntregue ? (
                      <span className="tag tag-on"><CheckSquare size={14} /> Atividade Entregue</span>
                    ) : (
                      <span className="tag"><Square size={14} /> Pendente</span>
                    )}
                  </button>

                  <div className="row-actions">
                    <button className="icon-btn" onClick={() => abrirEditar(aluno)} aria-label={`Editar aluno ${aluno.nome}`}>
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => setToDelete(aluno)}
                      aria-label={`Excluir aluno ${aluno.nome}`}
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
          title={form.editing ? 'Editar aluno' : 'Novo aluno'}
          icon={<Plus size={20} />}
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
                <span><School size={16} /> Ano Letivo</span>
                <input placeholder="Ex: 2026" value={ano} onChange={(e) => setAno(e.target.value)} />
              </label>
              <label className="field">
                <span><DoorOpen size={16} /> Sala</span>
                <input placeholder="Ex: 3º Ano A" value={sala} onChange={(e) => setSala(e.target.value)} />
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
