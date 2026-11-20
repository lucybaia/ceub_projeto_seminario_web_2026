import React, { useState, useEffect } from 'react'
import { User, UserRole, CINEMA_UNIDADES } from '../../types/user'
import { CreateUserSchema, UpdateUserSchema, formatCPF } from '../../schemas/user.schema'
import Button from '../ui/Button'
import CeubStem from '../brand/CeubStem'
import { X, ShieldAlert, Check } from 'lucide-react'

interface UserModalProps {
  isOpen: boolean
  userToEdit?: User | null
  currentRole: UserRole
  onClose: () => void
  onSave: (data: {
    nome: string
    email: string
    cpf?: string
    perfil: UserRole
    cinemaUnidade?: string
    ativo: boolean
  }) => Promise<void>
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  userToEdit,
  currentRole,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(userToEdit)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    perfil: 'CLIENTE' as UserRole,
    cinemaUnidade: '',
    ativo: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nome: userToEdit.nome,
        email: userToEdit.email,
        cpf: userToEdit.cpf || '',
        perfil: userToEdit.perfil,
        cinemaUnidade: userToEdit.cinemaUnidade || '',
        ativo: userToEdit.ativo,
      })
    } else {
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        perfil: 'CLIENTE',
        cinemaUnidade: '',
        ativo: true,
      })
    }
    setErrors({})
    setApiError(null)
  }, [userToEdit, isOpen])

  if (!isOpen) return null

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData((prev) => ({ ...prev, cpf: formatted }))
    if (errors.cpf) {
      setErrors((prev) => {
        const u = { ...prev }
        delete u.cpf
        return u
      })
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const u = { ...prev }
        delete u.name
        return u
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setApiError(null)

    // Validação com Zod em runtime
    const schema = isEditing ? UpdateUserSchema : CreateUserSchema
    const result = schema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf || undefined,
        perfil: formData.perfil,
        cinemaUnidade: formData.cinemaUnidade || undefined,
        ativo: formData.ativo,
      })
      onClose()
    } catch (err: any) {
      setApiError(err.message || 'Erro inesperado ao salvar usuário.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Restrição de atribuição de perfil para GERENTE
  const canAssignAdmin = currentRole === 'ADMIN'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-ceub-xl border border-ceub-surface-muted shadow-ceub-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        data-testid="user-modal"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ceub-surface-muted bg-ceub-surface-subtle">
          <div className="flex items-center gap-2">
            <CeubStem variant="single" color="magenta" height="1.25rem" />
            <h3 className="text-lg font-bold text-ceub-dark">
              {isEditing ? 'Editar Usuário' : 'Novo Usuário do Poltrona'}
            </h3>
          </div>
          <button
            onClick={onClose}
            data-testid="btn-cancel-user-x"
            className="text-gray-400 hover:text-ceub-dark transition p-1 rounded-md"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback de Erro do Serviço */}
        {apiError && (
          <div
            data-testid="alert-modal-error"
            className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-ceub-md flex items-center gap-2 text-rose-800 text-xs"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Formulário com validação Zod */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Nome Completo */}
          <div>
            <label htmlFor="user-nome" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
              Nome Completo *
            </label>
            <input
              id="user-nome"
              name="nome"
              type="text"
              data-testid="input-user-nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex.: Mariana Vasconcelos"
              className="w-full px-3.5 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
            />
            {errors.nome && (
              <p data-testid="error-user-nome" className="text-xs text-rose-600 mt-1 font-medium">
                {errors.nome}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="user-email" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
              E-mail *
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              data-testid="input-user-email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@poltrona.com.br"
              className="w-full px-3.5 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
            />
            {errors.email && (
              <p data-testid="error-user-email" className="text-xs text-rose-600 mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Perfil RBAC e CPF em grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user-perfil" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
                Perfil de Acesso (RBAC) *
              </label>
              <select
                id="user-perfil"
                name="perfil"
                data-testid="select-user-perfil"
                value={formData.perfil}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition bg-white"
              >
                <option value="CLIENTE">CLIENTE (Compra e ingressos)</option>
                <option value="PORTARIA">PORTARIA (Validação QR Code)</option>
                <option value="GERENTE">GERENTE (Gestão de salas/sessões)</option>
                {canAssignAdmin && <option value="ADMIN">ADMIN (Acesso total)</option>}
              </select>
              {errors.perfil && (
                <p data-testid="error-user-perfil" className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.perfil}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="user-cpf" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
                CPF {formData.perfil === 'CLIENTE' ? '*' : '(Opcional)'}
              </label>
              <input
                id="user-cpf"
                name="cpf"
                type="text"
                data-testid="input-user-cpf"
                value={formData.cpf}
                onChange={handleCpfChange}
                maxLength={14}
                placeholder="000.000.000-00"
                className="w-full px-3.5 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
              />
              {errors.cpf && (
                <p data-testid="error-user-cpf" className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.cpf}
                </p>
              )}
            </div>
          </div>

          {/* Unidade de Cinema (Obrigatória para GERENTE e PORTARIA) */}
          {(formData.perfil === 'GERENTE' || formData.perfil === 'PORTARIA' || formData.perfil === 'ADMIN') && (
            <div>
              <label htmlFor="user-unidade" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
                Unidade de Cinema Vinculada {formData.perfil !== 'ADMIN' ? '*' : ''}
              </label>
              <select
                id="user-unidade"
                name="cinemaUnidade"
                data-testid="select-user-unidade"
                value={formData.cinemaUnidade}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition bg-white"
              >
                <option value="">Selecione uma unidade...</option>
                {CINEMA_UNIDADES.map((u) => (
                  <option key={u.id} value={u.nome}>
                    {u.nome}
                  </option>
                ))}
              </select>
              {errors.cinemaUnidade && (
                <p data-testid="error-user-unidade" className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.cinemaUnidade}
                </p>
              )}
            </div>
          )}

          {/* Status Ativo */}
          <div className="pt-2 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="ativo"
                data-testid="checkbox-user-ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="w-4 h-4 text-ceub-magenta rounded border-gray-300 focus:ring-ceub-magenta"
              />
              <span className="text-sm font-medium text-ceub-dark">Conta Ativa</span>
            </label>
            <span className="text-xs text-gray-500">
              (Usuários inativos não conseguem autenticar no sistema)
            </span>
          </div>

          {/* Ações do Rodapé */}
          <div className="pt-4 border-t border-ceub-surface-muted flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              data-testid="btn-cancel-user"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              data-testid="btn-save-user"
              isLoading={isSubmitting}
              rightIcon={<Check className="w-4 h-4 ml-1" />}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
