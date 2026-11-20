import React, { useState, useEffect } from 'react'
import { User, UserRole, UserStatus } from '../../types/user'
import { userMockService } from '../../services/userMockService'
import { maskCPF } from '../../schemas/user.schema'
import UserKpiCards from '../../components/users/UserKpiCards'
import UserModal from '../../components/users/UserModal'
import DeleteUserModal from '../../components/users/DeleteUserModal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import CeubStem from '../../components/brand/CeubStem'
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

export const UsersManagementPage: React.FC = () => {
  // Simulador de Perfil Ativo (RBAC) para testes
  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN')

  // Estado dos usuários e carregamento
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [perfilFilter, setPerfilFilter] = useState<UserRole | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<UserStatus>('ALL')

  // Controle de visibilidade de CPF por usuário (LGPD)
  const [revealedCpfs, setRevealedCpfs] = useState<Record<string, boolean>>({})

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Carrega os usuários via Mock Service
  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await userMockService.getUsers({
        search: searchTerm,
        perfil: perfilFilter,
        status: statusFilter,
      })
      setUsers(data)
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao carregar usuários.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [searchTerm, perfilFilter, statusFilter])

  // Helpers de feedback com auto-dismiss
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Ações de CRUD
  const handleCreateOrUpdate = async (formData: {
    nome: string
    email: string
    cpf?: string
    perfil: UserRole
    cinemaUnidade?: string
    ativo: boolean
  }) => {
    if (userToEdit) {
      await userMockService.updateUser(userToEdit.id, formData)
      showFeedback('success', `Usuário "${formData.nome}" atualizado com sucesso!`)
    } else {
      await userMockService.createUser(formData)
      showFeedback('success', `Novo usuário "${formData.nome}" cadastrado com sucesso!`)
    }
    await loadUsers()
  }

  const handleToggleStatus = async (user: User) => {
    // Portaria não tem permissão para alterar status
    if (activeRole === 'PORTARIA') return

    try {
      const updated = await userMockService.toggleUserStatus(user.id)
      showFeedback(
        'success',
        `Status de "${updated.nome}" alterado para ${updated.ativo ? 'ATIVO' : 'INATIVO'}.`
      )
      await loadUsers()
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao alterar status.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      await userMockService.deleteUser(userToDelete.id)
      showFeedback('success', `Conta de "${userToDelete.nome}" excluída conforme diretrizes da LGPD.`)
      setUserToDelete(null)
      await loadUsers()
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao excluir usuário.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleResetData = async () => {
    try {
      await userMockService.resetData()
      showFeedback('success', 'Base de usuários fictícios restaurada para os dados padrão com sucesso!')
      await loadUsers()
    } catch (err: any) {
      showFeedback('error', err.message || 'Erro ao restaurar dados.')
    }
  }

  const toggleCpfVisibility = (userId: string) => {
    setRevealedCpfs((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  // Permissões RBAC computadas
  const canCreate = activeRole === 'ADMIN' || activeRole === 'GERENTE'
  const canEdit = activeRole === 'ADMIN' || activeRole === 'GERENTE'
  const canDelete = activeRole === 'ADMIN' // Somente ADMIN pode excluir definitivamente (LGPD)

  // Caso o perfil selecionado seja CLIENTE, bloqueia o acesso à tela administrativa
  if (activeRole === 'CLIENTE') {
    return (
      <div className="flex-1 bg-ceub-surface-subtle p-6 flex items-center justify-center min-h-[70vh]">
        <div
          data-testid="access-denied-view"
          className="max-w-md w-full bg-white rounded-ceub-xl border border-ceub-surface-muted p-8 text-center shadow-ceub-md"
        >
          {/* Switcher de perfil para permitir retornar ao teste */}
          <div className="mb-6 p-2 bg-ceub-surface-subtle rounded-ceub-md flex items-center justify-between text-xs">
            <span className="font-semibold text-ceub-dark">Perfil Ativo:</span>
            <div className="flex gap-1">
              {(['ADMIN', 'GERENTE', 'PORTARIA', 'CLIENTE'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  data-testid={`btn-role-${r.toLowerCase()}`}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                    activeRole === r
                      ? 'bg-ceub-dark text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-ceub-dark tracking-tight">403 — Acesso Restrito</h2>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            Seu perfil atual (<strong className="text-ceub-lilac">CLIENTE</strong>) não possui permissão para acessar o
            módulo de gestão de usuários do Poltrona.
          </p>
          <div className="mt-4 p-3 bg-ceub-surface-subtle rounded-ceub-md text-xs text-gray-500">
            Clientes têm acesso restrito ao catálogo de filmes, seleção de poltronas e consulta de ingressos adquiridos.
          </div>
          <div className="mt-6">
            <Button
              variant="institutional"
              size="sm"
              onClick={() => setActiveRole('ADMIN')}
              data-testid="btn-switch-to-admin"
            >
              Alternar para Perfil ADMIN
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full bg-ceub-surface-subtle py-6 px-4 sm:px-6 lg:px-12">
      <div className="w-full space-y-6">

        {/* 1. Barra de Sessão e Simulador RBAC */}
        <div
          data-testid="session-simulator-bar"
          className="bg-ceub-dark text-white rounded-ceub-lg p-4 shadow-ceub-sm flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-ceub-yellow" />
            <div>
              <p className="text-xs uppercase tracking-wider text-ceub-yellow font-bold">
                Simulador de Sessão / RBAC (Poltrona auth-service)
              </p>
              <p className="text-xs text-ceub-surface-muted">
                {activeRole === 'ADMIN' && 'Acesso Total: Gestão completa de usuários, perfis e exclusão LGPD.'}
                {activeRole === 'GERENTE' && 'Gerência: Criação e edição de usuários locais (exclusão bloqueada).'}
                {activeRole === 'PORTARIA' && 'Portaria: Apenas consulta de registros e validação de ingressos.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" data-testid="session-role-switcher">
            <span className="text-xs text-white/80 font-medium">Visualizando como:</span>
            {(['ADMIN', 'GERENTE', 'PORTARIA', 'CLIENTE'] as UserRole[]).map((r) => {
              const isActive = activeRole === r
              return (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  data-testid={`btn-role-${r.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-ceub-md text-xs font-bold transition-all ${
                    isActive
                      ? r === 'PORTARIA'
                        ? 'bg-ceub-yellow text-ceub-dark ring-2 ring-white'
                        : 'bg-ceub-magenta text-white shadow-sm ring-2 ring-white'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                >
                  {r}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Cabeçalho da Página e Botões de Ação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CeubStem variant="dual" color="lilac" height="2rem" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ceub-dark tracking-tight">
                Gestão de Usuários e Permissões
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Controle de acesso por perfil (RBAC) e conformidade LGPD da plataforma Poltrona.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              data-testid="btn-reset-mock"
              leftIcon={<RotateCcw className="w-4 h-4 mr-1" />}
            >
              Restaurar Mock
            </Button>

            {canCreate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setUserToEdit(null)
                  setIsModalOpen(true)
                }}
                data-testid="btn-new-user"
                leftIcon={<Plus className="w-4 h-4 mr-1" />}
              >
                Novo Usuário
              </Button>
            )}
          </div>
        </div>

        {/* 3. Feedback Toasts / Banners */}
        {feedback && (
          <div
            data-testid="alert-feedback"
            className={`p-4 rounded-ceub-md flex items-center justify-between text-sm shadow-sm transition-all animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4. KPI Cards de Resumo */}
        <UserKpiCards users={users} />

        {/* 5. Painel de Filtros e Busca */}
        <div className="bg-white rounded-ceub-lg p-4 border border-ceub-surface-muted shadow-ceub-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              data-testid="input-search-users"
              placeholder="Buscar por nome, e-mail ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filtro por Perfil */}
            <div className="flex items-center gap-2">
              <label htmlFor="filter-perfil" className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                Perfil:
              </label>
              <select
                id="filter-perfil"
                data-testid="filter-perfil"
                value={perfilFilter}
                onChange={(e) => setPerfilFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-1 focus:ring-ceub-purple outline-none bg-white font-medium"
              >
                <option value="ALL">Todos os Perfis</option>
                <option value="ADMIN">ADMIN</option>
                <option value="GERENTE">GERENTE</option>
                <option value="PORTARIA">PORTARIA</option>
                <option value="CLIENTE">CLIENTE</option>
              </select>
            </div>

            {/* Filtro por Status */}
            <div className="flex items-center gap-2">
              <label htmlFor="filter-status" className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                Status:
              </label>
              <select
                id="filter-status"
                data-testid="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-1 focus:ring-ceub-purple outline-none bg-white font-medium"
              >
                <option value="ALL">Todos os Status</option>
                <option value="ATIVO">Apenas Ativos</option>
                <option value="INATIVO">Apenas Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. Tabela de Usuários */}
        <div className="bg-white rounded-ceub-lg border border-ceub-surface-muted shadow-ceub-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-testid="table-users">
              <thead className="bg-ceub-surface-subtle border-b border-ceub-surface-muted text-xs uppercase tracking-wider text-ceub-dark font-bold">
                <tr>
                  <th className="py-3.5 px-4">Usuário</th>
                  <th className="py-3.5 px-4">Perfil (RBAC)</th>
                  <th className="py-3.5 px-4">CPF (LGPD)</th>
                  <th className="py-3.5 px-4">Unidade Vinculada</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ceub-surface-muted">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="inline-block w-6 h-6 border-2 border-ceub-purple border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs font-medium">Carregando dados mock...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500" data-testid="empty-users-state">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isRevealed = revealedCpfs[u.id] || false
                    return (
                      <tr
                        key={u.id}
                        data-testid={`user-row-${u.id}`}
                        className="hover:bg-ceub-surface-subtle/60 transition-colors"
                      >
                        {/* Nome e E-mail */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-ceub-dark" data-testid={`user-name-${u.id}`}>
                            {u.nome}
                          </div>
                          <div className="text-xs text-gray-500" data-testid={`user-email-${u.id}`}>
                            {u.email}
                          </div>
                        </td>

                        {/* Perfil com Badges oficiais CEUB */}
                        <td className="py-3 px-4" data-testid={`user-role-${u.id}`}>
                          {u.perfil === 'ADMIN' && <Badge variant="dark">ADMIN</Badge>}
                          {u.perfil === 'GERENTE' && <Badge variant="purple">GERENTE</Badge>}
                          {u.perfil === 'PORTARIA' && <Badge variant="yellow">PORTARIA</Badge>}
                          {u.perfil === 'CLIENTE' && <Badge variant="lilac">CLIENTE</Badge>}
                        </td>

                        {/* CPF com máscara LGPD e alternador de visualização */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-xs text-gray-700"
                              data-testid={`user-cpf-${u.id}`}
                            >
                              {u.cpf ? (isRevealed ? u.cpf : maskCPF(u.cpf)) : '—'}
                            </span>
                            {u.cpf && (
                              <button
                                onClick={() => toggleCpfVisibility(u.id)}
                                data-testid={`btn-toggle-cpf-${u.id}`}
                                className="text-gray-400 hover:text-ceub-purple transition p-1"
                                title={isRevealed ? 'Ocultar CPF' : 'Revelar CPF'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Unidade */}
                        <td className="py-3 px-4 text-xs text-gray-600" data-testid={`user-unidade-${u.id}`}>
                          {u.cinemaUnidade || <span className="text-gray-400 italic">Nenhuma</span>}
                        </td>

                        {/* Status (Ativo / Inativo) */}
                        <td className="py-3 px-4" data-testid={`user-status-${u.id}`}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                u.ativo ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            />
                            <span className={`text-xs font-semibold ${u.ativo ? 'text-emerald-700' : 'text-gray-500'}`}>
                              {u.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            {/* Toggle rápido de status (bloqueado para Portaria) */}
                            {canEdit && (
                              <button
                                onClick={() => handleToggleStatus(u)}
                                data-testid={`btn-toggle-status-${u.id}`}
                                className="text-gray-400 hover:text-ceub-purple transition ml-1"
                                title="Alternar status"
                              >
                                {u.ativo ? (
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Ações (Editar / Excluir) */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {canEdit ? (
                              <button
                                onClick={() => {
                                  setUserToEdit(u)
                                  setIsModalOpen(true)
                                }}
                                data-testid={`btn-edit-user-${u.id}`}
                                className="p-1.5 text-ceub-purple hover:bg-ceub-purple/10 rounded transition"
                                title="Editar Usuário"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="p-1.5 text-gray-300 cursor-not-allowed">
                                <Edit2 className="w-4 h-4" />
                              </span>
                            )}

                            {canDelete ? (
                              <button
                                onClick={() => setUserToDelete(u)}
                                data-testid={`btn-delete-user-${u.id}`}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Excluir Conta (LGPD)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span
                                className="p-1.5 text-gray-300 cursor-not-allowed"
                                title="Apenas ADMIN pode excluir usuários"
                              >
                                <Trash2 className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Modal de Criação / Edição */}
        <UserModal
          isOpen={isModalOpen}
          userToEdit={userToEdit}
          currentRole={activeRole}
          onClose={() => {
            setIsModalOpen(false)
            setUserToEdit(null)
          }}
          onSave={handleCreateOrUpdate}
        />

        {/* 8. Modal de Exclusão (LGPD) */}
        <DeleteUserModal
          isOpen={Boolean(userToDelete)}
          user={userToDelete}
          isLoading={isDeleting}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
}

export default UsersManagementPage
