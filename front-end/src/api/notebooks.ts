import { request } from './client'
import type { Notebook, NovoNotebook } from '../types'

export async function listarNotebooks(): Promise<Notebook[]> {
  const data = await request<{ notebooks?: Notebook[] }>('/notebook')
  return data?.notebooks ?? []
}

export function criarNotebook(notebook: NovoNotebook): Promise<void> {
  return request<void>('/notebook', { method: 'POST', body: JSON.stringify(notebook) })
}

// No back-end a atualização é POST /notebook/:id
export function atualizarNotebook(id: string, notebook: NovoNotebook): Promise<void> {
  return request<void>(`/notebook/${id}`, { method: 'POST', body: JSON.stringify(notebook) })
}

export function excluirNotebook(id: string): Promise<void> {
  return request<void>(`/notebook/${id}`, { method: 'DELETE' })
}
