import { z } from 'zod'

/**
 * Função utilitária para validação oficial de CPF (Dígitos verificadores e dígitos iguais)
 */
export function isValidCPF(cpfRaw: string): boolean {
  if (!cpfRaw) return false
  const cleanCPF = cpfRaw.replace(/\D/g, '')

  if (cleanCPF.length !== 11) return false
  // Rejeita sequências repetidas conhecidas (00000000000, 11111111111, etc.)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validação do 1º dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF.charAt(i), 10) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cleanCPF.charAt(9), 10)) return false

  // Validação do 2º dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF.charAt(i), 10) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cleanCPF.charAt(10), 10)) return false

  return true
}

/**
 * Formata um CPF numérico para o padrão visual 000.000.000-00
 */
export function formatCPF(cpfRaw: string): string {
  const digits = cpfRaw.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

/**
 * Mascara o CPF para exibição segura em conformidade com a LGPD (ex: ***.456.789-**)
 */
export function maskCPF(cpfFormatted?: string): string {
  if (!cpfFormatted) return '—'
  const clean = cpfFormatted.replace(/\D/g, '')
  if (clean.length !== 11) return cpfFormatted
  return `***.${clean.slice(3, 6)}.${clean.slice(6, 9)}-**`
}

// Sanitização básica de strings para prevenir injeção
const sanitizeString = (val: string) => val.trim().replace(/<[^>]*>?/gm, '')

export const UserRoleSchema = z.enum(['CLIENTE', 'PORTARIA', 'GERENTE', 'ADMIN'], {
  errorMap: () => ({ message: 'Selecione um perfil de acesso válido.' }),
})

/**
 * Schema base para criação de usuários no Poltrona (auth-service)
 */
export const CreateUserSchema = z
  .object({
    nome: z
      .string({ required_error: 'O nome é obrigatório.' })
      .transform(sanitizeString)
      .pipe(
        z
          .string()
          .min(3, 'O nome deve ter pelo menos 3 caracteres.')
          .max(120, 'O nome não pode exceder 120 caracteres.')
          .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, 'O nome contém caracteres inválidos.')
      ),
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .transform(sanitizeString)
      .pipe(
        z
          .string()
          .email('Informe um endereço de e-mail válido (ex: usuario@poltrona.com.br).')
          .max(100, 'E-mail muito longo.')
      ),
    cpf: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : ''))
      .refine((val) => !val || isValidCPF(val), {
        message: 'CPF inválido. Verifique os dígitos informados.',
      }),
    perfil: UserRoleSchema,
    cinemaUnidade: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : '')),
    ativo: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    // Regra 1: CLIENTE exige CPF obrigatório para conformidade de meia-entrada / LGPD
    if (data.perfil === 'CLIENTE') {
      if (!data.cpf || data.cpf.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cpf'],
          message: 'O CPF é obrigatório para clientes (necessário para validação de meia-entrada conforme LGPD).',
        })
      }
    }

    // Regra 2: GERENTE ou PORTARIA exigem vínculo a uma unidade de cinema
    if (data.perfil === 'GERENTE' || data.perfil === 'PORTARIA') {
      if (!data.cinemaUnidade || data.cinemaUnidade.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cinemaUnidade'],
          message: 'Vincule uma unidade de cinema obrigatória para os perfis Gerente e Portaria.',
        })
      }
    }
  })

export type CreateUserInput = z.infer<typeof CreateUserSchema>

/**
 * Schema para atualização de usuários existentes
 */
export const UpdateUserSchema = z
  .object({
    nome: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : undefined))
      .pipe(
        z
          .string()
          .min(3, 'O nome deve ter pelo menos 3 caracteres.')
          .max(120, 'O nome não pode exceder 120 caracteres.')
          .optional()
      ),
    email: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : undefined))
      .pipe(
        z
          .string()
          .email('Informe um endereço de e-mail válido.')
          .optional()
      ),
    cpf: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : ''))
      .refine((val) => !val || isValidCPF(val), {
        message: 'CPF inválido.',
      }),
    perfil: UserRoleSchema.optional(),
    cinemaUnidade: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val) : '')),
    ativo: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.perfil === 'CLIENTE' && (!data.cpf || data.cpf.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cpf'],
        message: 'O CPF é obrigatório para clientes.',
      })
    }
    if ((data.perfil === 'GERENTE' || data.perfil === 'PORTARIA') && (!data.cinemaUnidade || data.cinemaUnidade.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cinemaUnidade'],
        message: 'Vincule uma unidade de cinema para Gerente ou Portaria.',
      })
    }
  })

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
