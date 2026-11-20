import React from 'react'
import { User } from '../../types/user'
import Button from '../ui/Button'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteUserModalProps {
  isOpen: boolean
  user: User | null
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  user,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-ceub-xl border border-rose-200 shadow-ceub-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        data-testid="delete-user-modal"
      >
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-ceub-dark tracking-tight">
            Excluir Conta de Usuário (LGPD)
          </h3>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Você está prestes a excluir definitivamente os dados de{' '}
            <strong className="text-ceub-dark">{user.nome}</strong> (<span className="text-gray-700">{user.email}</span>).
          </p>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-ceub-md text-xs text-amber-900 leading-normal">
            <p className="font-semibold mb-1">Aviso de Conformidade LGPD (Art. 18, VI):</p>
            <p>
              Esta operação elimina os dados cadastrais do titular de forma irreversível do banco do Poltrona.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              data-testid="btn-cancel-delete"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
              data-testid="btn-confirm-delete"
              isLoading={isLoading}
              onClick={onConfirm}
              rightIcon={<Trash2 className="w-4 h-4 ml-1" />}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteUserModal
