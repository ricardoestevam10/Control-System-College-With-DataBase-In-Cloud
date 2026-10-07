const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique se o back-end está rodando.', 0)
  }

  if (!res.ok) {
    throw new ApiError(`O servidor respondeu com erro (${res.status}).`, res.status)
  }

  // 201 e 204 vêm sem corpo no back-end
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
