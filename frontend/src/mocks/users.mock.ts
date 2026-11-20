import { User } from '../types/user'

/**
 * Base de dados fictícia inicial (Mock-First) para simulação do auth-service do Poltrona.
 * Contém mais de 10 usuários com CPFs matematicamente válidos, cobrindo todos os perfis RBAC:
 * CLIENTE, PORTARIA, GERENTE, ADMIN, com status ATIVO e INATIVO.
 */
export const INITIAL_MOCK_USERS: User[] = [
  // 1. ADMIN - Administrador Geral
  {
    id: 'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    nome: 'Carlos Eduardo Souza',
    email: 'carlos.eduardo@poltrona.com.br',
    cpf: '529.982.247-25',
    perfil: 'ADMIN',
    cinemaUnidade: 'Todas as Unidades',
    ativo: true,
    criadoEm: '2026-01-10T09:30:00.000Z',
  },
  // 2. ADMIN - Administradora de Segurança
  {
    id: 'b2c3d4e5-f6a7-48b9-0c1d-2e3f4a5b6c7d',
    nome: 'Beatriz Vasconcelos',
    email: 'beatriz.vasconcelos@poltrona.com.br',
    cpf: '714.287.498-50',
    perfil: 'ADMIN',
    cinemaUnidade: 'Todas as Unidades',
    ativo: true,
    criadoEm: '2026-02-15T14:20:00.000Z',
  },
  // 3. GERENTE - Unidade Asa Norte (Ativo)
  {
    id: 'c3d4e5f6-a7b8-49c0-1d2e-3f4a5b6c7d8e',
    nome: 'Juliana Mendes Rocha',
    email: 'juliana.mendes@poltrona.com.br',
    cpf: '388.127.478-20',
    perfil: 'GERENTE',
    cinemaUnidade: 'Poltrona Asa Norte',
    ativo: true,
    criadoEm: '2026-03-01T10:00:00.000Z',
  },
  // 4. GERENTE - Unidade Águas Claras (Ativo)
  {
    id: 'd4e5f6a7-b8c9-40d1-2e3f-4a5b6c7d8e9f',
    nome: 'Marcelo Pires Nogueira',
    email: 'marcelo.pires@poltrona.com.br',
    cpf: '832.176.438-09',
    perfil: 'GERENTE',
    cinemaUnidade: 'Poltrona Águas Claras',
    ativo: true,
    criadoEm: '2026-03-12T11:45:00.000Z',
  },
  // 5. GERENTE - Unidade Taguatinga (Inativo para testes de status)
  {
    id: 'e5f6a7b8-c9d0-41e2-3f4a-5b6c7d8e9f0a',
    nome: 'Fernando Guimarães Lima',
    email: 'fernando.lima@poltrona.com.br',
    cpf: '942.385.128-66',
    perfil: 'GERENTE',
    cinemaUnidade: 'Poltrona Taguatinga',
    ativo: false,
    criadoEm: '2026-04-05T16:15:00.000Z',
  },
  // 6. PORTARIA - Asa Norte (Ativo)
  {
    id: 'f6a7b8c9-d0e1-42f3-4a5b-6c7d8e9f0a1b',
    nome: 'Roberto Silva Validador',
    email: 'roberto.validador@poltrona.com.br',
    cpf: '012.345.678-90',
    perfil: 'PORTARIA',
    cinemaUnidade: 'Poltrona Asa Norte',
    ativo: true,
    criadoEm: '2026-05-18T08:00:00.000Z',
  },
  // 7. PORTARIA - Águas Claras (Ativo)
  {
    id: 'a7b8c9d0-e1f2-43a4-5b6c-7d8e9f0a1b2c',
    nome: 'Camila Alcantara Santos',
    email: 'camila.santos@poltrona.com.br',
    cpf: '453.829.108-74',
    perfil: 'PORTARIA',
    cinemaUnidade: 'Poltrona Águas Claras',
    ativo: true,
    criadoEm: '2026-06-22T13:30:00.000Z',
  },
  // 8. PORTARIA - Taguatinga (Inativo)
  {
    id: 'b8c9d0e1-f2a3-44b5-6c7d-8e9f0a1b2c3d',
    nome: 'Lucas Martins Costa',
    email: 'lucas.costa@poltrona.com.br',
    cpf: '621.904.738-18',
    perfil: 'PORTARIA',
    cinemaUnidade: 'Poltrona Taguatinga',
    ativo: false,
    criadoEm: '2026-07-04T15:00:00.000Z',
  },
  // 9. CLIENTE - Cliente Frequente (Meia-Entrada Universitária)
  {
    id: 'c9d0e1f2-a3b4-45c6-7d8e-9f0a1b2c3d4e',
    nome: 'Mariana Duarte Prado',
    email: 'mariana.prado@aluno.ceub.edu.br',
    cpf: '158.492.308-01',
    perfil: 'CLIENTE',
    cinemaUnidade: undefined,
    ativo: true,
    criadoEm: '2026-08-01T17:25:00.000Z',
  },
  // 10. CLIENTE - Cliente Cineasta (Ativo)
  {
    id: 'd0e1f2a3-b4c5-46d7-8e9f-0a1b2c3d4e5f',
    nome: 'Thiago Faria Albuquerque',
    email: 'thiago.albuquerque@gmail.com',
    cpf: '294.851.038-42',
    perfil: 'CLIENTE',
    cinemaUnidade: undefined,
    ativo: true,
    criadoEm: '2026-08-14T20:10:00.000Z',
  },
  // 11. CLIENTE - Cliente Inativo
  {
    id: 'e1f2a3b4-c5d6-47e8-9f0a-1b2c3d4e5f6a',
    nome: 'Larissa Ferreira Dias',
    email: 'larissa.dias@yahoo.com.br',
    cpf: '739.102.848-55',
    perfil: 'CLIENTE',
    cinemaUnidade: undefined,
    ativo: false,
    criadoEm: '2026-09-02T19:00:00.000Z',
  },
]

const STORAGE_KEY = 'poltrona_mock_users_v1'

/**
 * NOTA DE SEGURANÇA E CONFORMIDADE:
 * O uso de localStorage neste mock destina-se EXCLUSIVAMENTE a manter a persistência
 * dos dados simulados durante a sessão de desenvolvimento e testes E2E sem backend ativo.
 * Em ambiente de produção, toda autenticação e controle de sessão do Poltrona utiliza
 * cookies HttpOnly + Secure + SameSite gerenciados pelo backend / auth-service.
 */

export function getStoredMockUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveStoredMockUsers(INITIAL_MOCK_USERS)
      return [...INITIAL_MOCK_USERS]
    }
    const parsed = JSON.parse(raw) as User[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_MOCK_USERS]
  } catch (err) {
    console.warn('[Poltrona Mock] Erro ao ler mock do localStorage, usando base inicial.', err)
    return [...INITIAL_MOCK_USERS]
  }
}

export function saveStoredMockUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('[Poltrona Mock] Falha ao persistir no localStorage:', err)
  }
}

/**
 * Restaura o banco de usuários para a massa de dados inicial.
 */
export function resetMockUsers(): User[] {
  saveStoredMockUsers(INITIAL_MOCK_USERS)
  return [...INITIAL_MOCK_USERS]
}
