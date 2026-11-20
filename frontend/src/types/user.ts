export type UserRole = 'CLIENTE' | 'PORTARIA' | 'GERENTE' | 'ADMIN'

export type UserStatus = 'ALL' | 'ATIVO' | 'INATIVO'

export interface User {
  id: string
  nome: string
  email: string
  cpf?: string
  perfil: UserRole
  cinemaUnidade?: string
  ativo: boolean
  criadoEm: string
}

export interface CreateUserDTO {
  nome: string
  email: string
  cpf?: string
  perfil: UserRole
  cinemaUnidade?: string
  ativo?: boolean
}

export interface UpdateUserDTO {
  nome?: string
  email?: string
  cpf?: string
  perfil?: UserRole
  cinemaUnidade?: string
  ativo?: boolean
}

export interface UserFilterParams {
  search?: string
  perfil?: UserRole | 'ALL'
  status?: UserStatus
}

export interface CinemaUnitOption {
  id: string
  nome: string
}

export const CINEMA_UNIDADES: CinemaUnitOption[] = [
  { id: 'asa-norte', nome: 'Poltrona Asa Norte' },
  { id: 'aguas-claras', nome: 'Poltrona Águas Claras' },
  { id: 'taguatinga', nome: 'Poltrona Taguatinga' },
  { id: 'todas', nome: 'Todas as Unidades' },
]
