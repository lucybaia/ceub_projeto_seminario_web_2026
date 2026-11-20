import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Variantes de cores oficiais CEUB:
   * - 'yellow': SEMPRE texto #43054e para contraste e acessibilidade estrita
   * - 'lilac': Lilás característico com texto branco
   * - 'magenta': Destaque de conversão
   * - 'dark': Institucional de alto contraste
   * - 'purple': Neutro-institucional
   * - 'muted': Fundo suave para categorizações sutis
   */
  variant?: 'yellow' | 'lilac' | 'magenta' | 'dark' | 'purple' | 'muted'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'lilac',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  // Regra de acessibilidade: nunca texto branco em amarelo (#fde100)
  const variantStyles = {
    yellow: 'bg-ceub-yellow text-ceub-dark font-bold border border-yellow-300',
    lilac: 'bg-ceub-lilac text-white font-medium',
    magenta: 'bg-ceub-magenta text-white font-medium',
    dark: 'bg-ceub-dark text-white font-medium',
    purple: 'bg-ceub-purple text-white font-medium',
    muted: 'bg-ceub-surface-muted text-ceub-dark font-medium border border-ceub-surface-muted',
  }

  const dotStyles = {
    yellow: 'bg-ceub-dark',
    lilac: 'bg-white',
    magenta: 'bg-white',
    dark: 'bg-ceub-yellow',
    purple: 'bg-white',
    muted: 'bg-ceub-purple',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  )
}

export default Badge
