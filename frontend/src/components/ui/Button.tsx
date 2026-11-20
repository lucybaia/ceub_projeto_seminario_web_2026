import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variantes alinhadas ao Design System institucional do CEUB:
   * - 'primary': Magenta (#ec0089) - CTA principal de conversão
   * - 'institutional': Roxo-Escuro (#43054e) - Ações institucionais de alto contraste
   * - 'secondary': Roxo (#662c92) - Ações secundárias e de apoio
   * - 'accent': Amarelo (#fde100) - Alerta positivo e alto impacto (SEMPRE com texto #43054e)
   * - 'outline': Borda em lilás (#bf0087) ou roxo com fundo transparente
   * - 'ghost': Transparente com hover suave em cinza institucional
   */
  variant?: 'primary' | 'institutional' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-ceub-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  }

  const variantStyles = {
    // Magenta: CTA principal (#ec0089)
    primary:
      'bg-ceub-magenta text-white hover:bg-[#d1007a] focus:ring-ceub-magenta shadow-sm hover:shadow-ceub-glow-magenta',
    
    // Roxo-Escuro: Primária institucional (#43054e)
    institutional:
      'bg-ceub-dark text-white hover:bg-ceub-purple focus:ring-ceub-dark shadow-sm',
    
    // Roxo: Secundária (#662c92)
    secondary:
      'bg-ceub-purple text-white hover:bg-ceub-dark focus:ring-ceub-purple shadow-sm',
    
    // Amarelo: Destaque com rigor de acessibilidade (texto SEMPRE #43054e)
    accent:
      'bg-ceub-yellow text-ceub-dark hover:brightness-95 focus:ring-ceub-yellow shadow-sm font-bold',
    
    // Outline: Borda e texto com a paleta CEUB
    outline:
      'border-2 border-ceub-purple text-ceub-purple hover:bg-ceub-purple hover:text-white focus:ring-ceub-purple',
    
    // Ghost
    ghost:
      'text-ceub-dark hover:bg-ceub-surface-subtle focus:ring-ceub-purple',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
}

export default Button
