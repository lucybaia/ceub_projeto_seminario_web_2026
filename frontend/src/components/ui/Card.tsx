import React from 'react'


export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adiciona o detalhe gráfico da haste vertical do CEUB como destaque visual:
   * - 'stem-left': Borda lateral com haste em lilás (#bf0087)
   * - 'stem-top': Barra superior decorativa
   * - 'none': Sem detalhe de haste
   */
  stemAccent?: 'stem-left' | 'stem-top' | 'none'
  interactive?: boolean
}

export const Card: React.FC<CardProps> = ({
  stemAccent = 'none',
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'bg-white border border-ceub-surface-muted rounded-ceub-lg p-6 shadow-ceub-sm transition-all duration-200'
  const interactiveClasses = interactive
    ? 'hover:shadow-ceub-md hover:border-ceub-purple/30 cursor-pointer active:scale-[0.99]'
    : ''

  return (
    <div
      className={`relative overflow-hidden ${baseClasses} ${interactiveClasses} ${className}`.trim()}
      {...props}
    >
      {stemAccent === 'stem-left' && (
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-ceub-lilac" />
      )}
      {stemAccent === 'stem-top' && (
        <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ceub-lilac to-ceub-magenta" />
      )}
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex items-start justify-between gap-4 mb-3 ${className}`} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-lg font-bold text-ceub-dark tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
)

export default Card
