import { User, CreateUserDTO, UpdateUserDTO, UserFilterParams } from '../types/user'
import { getStoredMockUsers, saveStoredMockUsers, resetMockUsers } from '../mocks/users.mock'
import { formatCPF } from '../schemas/user.schema'

export class ApiError extends Error {
  public statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

/**
 * Latência artificial controlada para simulação realista de rede (Meta arquitetural: < 300ms)
 */
const simulateLatency = (minMs = 200, maxMs = 350): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Gera um UUID v4 fictício compatível com navegadores
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Serviço Mock Assíncrono que simula a API REST do auth-service do Poltrona
 */
export const userMockService = {
  /**
   * Lista usuários com suporte a filtros combinados de busca, perfil e status
   */
  async getUsers(filters?: UserFilterParams): Promise<User[]> {
    await simulateLatency()
    let users = getStoredMockUsers()

    if (!filters) return users

    // Filtro por texto de busca (nome, e-mail ou dígitos de CPF)
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase()
      const cleanDigits = q.replace(/\D/g, '')

      users = users.filter((u) => {
        const matchesName = u.nome.toLowerCase().includes(q)
        const matchesEmail = u.email.toLowerCase().includes(q)
        const matchesCpf = cleanDigits && u.cpf ? u.cpf.replace(/\D/g, '').includes(cleanDigits) : false
        return matchesName || matchesEmail || matchesCpf
      })
    }

    // Filtro por Perfil RBAC
    if (filters.perfil && filters.perfil !== 'ALL') {
      users = users.filter((u) => u.perfil === filters.perfil)
    }

    // Filtro por Status
    if (filters.status && filters.status !== 'ALL') {
      const isAtivo = filters.status === 'ATIVO'
      users = users.filter((u) => u.ativo === isAtivo)
    }

    // Ordenação: mais recentes primeiro
    return users.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
  },

  /**
   * Busca um usuário pelo ID
   */
  async getUserById(id: string): Promise<User> {
    await simulateLatency(150, 250)
    const users = getStoredMockUsers()
    const user = users.find((u) => u.id === id)

    if (!user) {
      throw new ApiError(404, `Usuário com ID ${id} não foi encontrado.`)
    }

    return user
  },

  /**
   * Cria um novo usuário com checagem de unicidade (E-mail e CPF)
   */
  async createUser(payload: CreateUserDTO): Promise<User> {
    await simulateLatency(250, 400)
    const users = getStoredMockUsers()

    // Validação de unicidade de e-mail (Simula HTTP 409 Conflict)
    const emailNormalized = payload.email.trim().toLowerCase()
    const emailExists = users.some((u) => u.email.toLowerCase() === emailNormalized)
    if (emailExists) {
      throw new ApiError(409, `O e-mail "${payload.email}" já está cadastrado no sistema.`)
    }

    // Validação de unicidade de CPF (se fornecido)
    if (payload.cpf && payload.cpf.trim() !== '') {
      const cleanCPF = payload.cpf.replace(/\D/g, '')
      const cpfExists = users.some((u) => u.cpf && u.cpf.replace(/\D/g, '') === cleanCPF)
      if (cpfExists) {
        throw new ApiError(409, `O CPF informado já está vinculado a outra conta.`)
      }
    }

    const newUser: User = {
      id: generateUUID(),
      nome: payload.nome.trim(),
      email: emailNormalized,
      cpf: payload.cpf ? formatCPF(payload.cpf) : undefined,
      perfil: payload.perfil,
      cinemaUnidade: payload.cinemaUnidade?.trim() || undefined,
      ativo: payload.ativo ?? true,
      criadoEm: new Date().toISOString(),
    }

    users.unshift(newUser)
    saveStoredMockUsers(users)

    return newUser
  },

  /**
   * Atualiza dados de um usuário existente
   */
  async updateUser(id: string, payload: UpdateUserDTO): Promise<User> {
    await simulateLatency(250, 400)
    const users = getStoredMockUsers()
    const index = users.findIndex((u) => u.id === id)

    if (index === -1) {
      throw new ApiError(404, `Usuário não encontrado para atualização.`)
    }

    const current = users[index]

    // Validação de e-mail único se alterado
    if (payload.email && payload.email.trim().toLowerCase() !== current.email.toLowerCase()) {
      const emailNormalized = payload.email.trim().toLowerCase()
      const emailExists = users.some((u) => u.id !== id && u.email.toLowerCase() === emailNormalized)
      if (emailExists) {
        throw new ApiError(409, `O e-mail "${payload.email}" já está em uso por outro usuário.`)
      }
    }

    // Validação de CPF único se alterado
    if (payload.cpf && payload.cpf.trim() !== '') {
      const cleanCPF = payload.cpf.replace(/\D/g, '')
      const cpfExists = users.some((u) => u.id !== id && u.cpf && u.cpf.replace(/\D/g, '') === cleanCPF)
      if (cpfExists) {
        throw new ApiError(409, `O CPF informado já pertence a outro usuário.`)
      }
    }

    const updatedUser: User = {
      ...current,
      ...(payload.nome !== undefined && { nome: payload.nome.trim() }),
      ...(payload.email !== undefined && { email: payload.email.trim().toLowerCase() }),
      ...(payload.cpf !== undefined && { cpf: payload.cpf ? formatCPF(payload.cpf) : undefined }),
      ...(payload.perfil !== undefined && { perfil: payload.perfil }),
      ...(payload.cinemaUnidade !== undefined && { cinemaUnidade: payload.cinemaUnidade.trim() || undefined }),
      ...(payload.ativo !== undefined && { ativo: payload.ativo }),
    }

    users[index] = updatedUser
    saveStoredMockUsers(users)

    return updatedUser
  },

  /**
   * Alterna o status ativo/inativo sem perda de histórico
   */
  async toggleUserStatus(id: string): Promise<User> {
    await simulateLatency(150, 250)
    const users = getStoredMockUsers()
    const user = users.find((u) => u.id === id)

    if (!user) {
      throw new ApiError(404, `Usuário não encontrado.`)
    }

    user.ativo = !user.ativo
    saveStoredMockUsers(users)
    return { ...user }
  },

  /**
   * Exclusão definitiva de conta (Simulando o direito ao esquecimento / exclusão da LGPD)
   */
  async deleteUser(id: string): Promise<void> {
    await simulateLatency(200, 350)
    const users = getStoredMockUsers()
    const initialLen = users.length
    const filtered = users.filter((u) => u.id !== id)

    if (filtered.length === initialLen) {
      throw new ApiError(404, `Usuário não encontrado para exclusão.`)
    }

    saveStoredMockUsers(filtered)
  },

  /**
   * Restaura os dados iniciais do mock para facilitar demonstrações
   */
  async resetData(): Promise<User[]> {
    await simulateLatency(150, 200)
    return resetMockUsers()
  },
}
