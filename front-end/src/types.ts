export interface Aluno {
  _id: string
  nome: string
  RA?: number
  sala: string
  ano: string
}

export interface Notebook {
  _id: string
  numero: number
  // o back-end devolve o aluno já populado
  aluno: Aluno | null
}

export interface NovoAluno {
  nome: string
  RA?: number
  sala: string
  ano: string
}

export interface NovoNotebook {
  numero: number
  aluno: string
}
