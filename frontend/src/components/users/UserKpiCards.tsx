import React from 'react'
import { User } from '../../types/user'
import { Users, Shield, Film, QrCode, UserCheck } from 'lucide-react'

interface UserKpiCardsProps {
  users: User[]
}

export const UserKpiCards: React.FC<UserKpiCardsProps> = ({ users }) => {
  const total = users.length
  const admins = users.filter((u) => u.perfil === 'ADMIN').length
  const gerentes = users.filter((u) => u.perfil === 'GERENTE').length
  const portaria = users.filter((u) => u.perfil === 'PORTARIA').length
  const clientes = users.filter((u) => u.perfil === 'CLIENTE').length
  const ativos = users.filter((u) => u.ativo).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" data-testid="user-kpi-cards">
      {/* 1. Total Geral */}
      <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm relative overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-dark" />
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ceub-dark">Total Usuários</span>
          <Users className="w-4 h-4 text-ceub-dark" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-ceub-dark" data-testid="kpi-total-users">{total}</span>
          <span className="text-xs text-emerald-600 font-medium">({ativos} ativos)</span>
        </div>
      </div>

      {/* 2. ADMIN */}
      <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm relative overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-dark" />
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ceub-dark">Admin</span>
          <Shield className="w-4 h-4 text-ceub-dark" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-ceub-dark" data-testid="kpi-admin-users">{admins}</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-ceub-dark text-white font-medium">Geral</span>
        </div>
      </div>

      {/* 3. GERENTE */}
      <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm relative overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-purple" />
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ceub-purple">Gerentes</span>
          <Film className="w-4 h-4 text-ceub-purple" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-ceub-purple" data-testid="kpi-gerente-users">{gerentes}</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-ceub-purple text-white font-medium">Unidades</span>
        </div>
      </div>

      {/* 4. PORTARIA */}
      <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm relative overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-yellow" />
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ceub-dark">Portaria</span>
          <QrCode className="w-4 h-4 text-ceub-purple" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-ceub-dark" data-testid="kpi-portaria-users">{portaria}</span>
          {/* Regra estrita de acessibilidade CEUB: fundo amarelo usa sempre texto dark */}
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-ceub-yellow text-ceub-dark font-bold">Validação</span>
        </div>
      </div>

      {/* 5. CLIENTE */}
      <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm relative overflow-hidden col-span-2 md:col-span-1">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-lilac" />
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ceub-lilac">Clientes</span>
          <UserCheck className="w-4 h-4 text-ceub-lilac" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-ceub-dark" data-testid="kpi-cliente-users">{clientes}</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-ceub-lilac text-white font-medium">Ingressos</span>
        </div>
      </div>
    </div>
  )
}

export default UserKpiCards
