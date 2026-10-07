import { request } from './client'
import type { Aluno, NovoAluno } from '../types'

export async function listarAlunos(): Promise<Aluno[]> {
  const data = await request<{ alunos?: Aluno[] }>('/alunos')
  return data?.alunos ?? []
}

export function criarAluno(aluno: NovoAluno): Promise<void> {
  return request<void>('/aluno', { method: 'POST', body: JSON.stringify(aluno) })
}

export function atualizarAluno(id: string, aluno: Partial<NovoAluno>): Promise<void> {
  return request<void>(`/aluno/${id}`, { method: 'PUT', body: JSON.stringify(aluno) })
}

export function excluirAluno(id: string): Promise<void> {
  return request<void>(`/aluno/${id}`, { method: 'DELETE' })
}