import React, { useState } from 'react'
import { z } from 'zod'
import Button from './Button'
import Badge from './Badge'
import CeubStem from '../brand/CeubStem'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

// Schema estrito de validação em runtime com Zod
export const LeadFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(100, 'Nome muito longo.')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'O nome deve conter apenas letras e espaços.'),
  email: z
    .string()
    .email('Informe um e-mail institucional ou pessoal válido.'),
  phone: z
    .string()
    .min(10, 'Informe um telefone com DDD válido (ex: 61 99999-9999).'),
  courseInterest: z
    .string()
    .min(1, 'Selecione um curso de graduação ou pós.'),
  acceptTerms: z
    .literal(true, {
      errorMap: () => ({ message: 'É obrigatório aceitar a política de privacidade do CEUB.' }),
    }),
})

export type LeadFormData = z.infer<typeof LeadFormSchema>

export const InstitutionalLeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseInterest: 'Ciência da Computação',
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Limpa o erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage(null)

    // Validação estrita via Zod
    const result = LeadFormSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    // Submissão segura
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sessão segura: cookies HttpOnly automáticos via credentials
        credentials: 'include',
        body: JSON.stringify(result.data),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage(data.message || 'Inscrição realizada com sucesso! Nossa equipe entrará em contato.')
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          courseInterest: 'Ciência da Computação',
          acceptTerms: false,
        })
      } else {
        setErrors({ form: 'Ocorreu um erro no servidor ao registrar sua inscrição. Tente novamente.' })
      }
    } catch (err) {
      // Fallback em caso de erro de rede
      setErrors({ form: 'Não foi possível conectar ao serviço de inscrições.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-ceub-xl border border-ceub-surface-muted shadow-ceub-md p-6 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CeubStem variant="single" color="magenta" height="1.25rem" />
          <h3 className="text-xl font-bold text-ceub-dark">Inscreva-se no CEUB</h3>
        </div>
        <Badge variant="yellow" dot>
          Vestibular 2026
        </Badge>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Preencha seus dados abaixo para receber informações exclusivas sobre cursos, bolsas de estudo e processos seletivos.
      </p>

      {successMessage && (
        <div
          data-testid="alert-lead-success"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-ceub-md flex items-start gap-3 text-emerald-800 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Sucesso!</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {errors.form && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-ceub-md flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p>{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nome Completo */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
            Nome Completo
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            data-testid="input-fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ex: Mariana Vasconcelos"
            className="w-full px-3.5 py-2.5 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
          />
          {errors.fullName && (
            <p data-testid="error-fullName" className="text-xs text-rose-600 mt-1 font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* E-mail e Telefone em grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              data-testid="input-email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu.email@exemplo.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
            />
            {errors.email && (
              <p data-testid="error-email" className="text-xs text-rose-600 mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
              Telefone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              data-testid="input-phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(61) 99999-9999"
              className="w-full px-3.5 py-2.5 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition"
            />
            {errors.phone && (
              <p data-testid="error-phone" className="text-xs text-rose-600 mt-1 font-medium">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Curso de Interesse */}
        <div>
          <label htmlFor="courseInterest" className="block text-xs font-semibold text-ceub-dark uppercase tracking-wider mb-1">
            Curso de Interesse
          </label>
          <select
            id="courseInterest"
            name="courseInterest"
            data-testid="select-course"
            value={formData.courseInterest}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-ceub-md border border-ceub-surface-muted focus:border-ceub-purple focus:ring-2 focus:ring-ceub-purple/20 outline-none transition bg-white"
          >
            <option value="Ciência da Computação">Ciência da Computação (Asa Norte)</option>
            <option value="Direito">Direito (Asa Norte / Taguatinga)</option>
            <option value="Medicina">Medicina (Asa Norte)</option>
            <option value="Administração">Administração (Taguatinga)</option>
            <option value="Psicologia">Psicologia (Asa Norte)</option>
          </select>
        </div>

        {/* Termos de Privacidade */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              data-testid="checkbox-terms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-ceub-magenta rounded border-gray-300 focus:ring-ceub-magenta"
            />
            <span className="text-xs text-gray-600 leading-normal">
              Concordo em receber comunicações acadêmicas do CEUB e declaro que li a{' '}
              <a href="#" className="text-ceub-purple underline hover:text-ceub-magenta">
                Política de Privacidade
              </a>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p data-testid="error-acceptTerms" className="text-xs text-rose-600 mt-1 font-medium">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Botão de Envio (CTA Magenta Institucional) */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            data-testid="btn-submit-lead"
            rightIcon={<Send className="w-4 h-4 ml-1" />}
          >
            Confirmar Inscrição
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InstitutionalLeadForm
