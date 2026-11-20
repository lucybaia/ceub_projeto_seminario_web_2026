import React from 'react'

export interface CeubStemProps {
  /**
   * Tipo da haste:
   * - 'single': Uma barra vertical estilizada
   * - 'dual': O par icônico de hastes assimétricas do CEUB (superior e inferior)
   * - 'indicator': Barra indicadora para itens de menu e tabs ativas
   * - 'divider': Divisor de seção com o detalhe característico da marca
   */
  variant?: 'single' | 'dual' | 'indicator' | 'divider'
  color?: 'lilac' | 'magenta' | 'yellow'
  height?: string
  className?: string
}

const colorClasses = {
  lilac: 'bg-ceub-lilac',
  magenta: 'bg-ceub-magenta',
  yellow: 'bg-ceub-yellow',
}

export const CeubStem: React.FC<CeubStemProps> = ({
  variant = 'single',
  color = 'lilac',
  height,
  className = '',
}) => {
  const bgClass = colorClasses[color]

  if (variant === 'dual') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 h-7 relative select-none ${className}`}
        aria-hidden="true"
      >
        {/* Haste alta (topo) */}
        <span
          className={`w-1 rounded-sm ${bgClass}`}
          style={{ height: height || '1.75rem', transform: 'translateY(-25%)' }}
        />
        {/* Haste baixa (base) */}
        <span
          className={`w-1 rounded-sm ${bgClass}`}
          style={{ height: height || '1.75rem', transform: 'translateY(25%)' }}
        />
      </div>
    )
  }

  if (variant === 'indicator') {
    return (
      <span
        className={`inline-block w-1 rounded-full ${bgClass} ${className}`}
        style={{ height: height || '1.25rem' }}
        aria-hidden="true"
      />
    )
  }

  if (variant === 'divider') {
    return (
      <div
        className={`flex items-center gap-3 w-full my-6 select-none ${className}`}
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-ceub-surface-muted" />
        <span className={`w-1.5 h-4 rounded-sm ${bgClass}`} />
        <span className="h-px flex-1 bg-ceub-surface-muted" />
      </div>
    )
  }

  // Single stem padrão
  return (
    <span
      className={`inline-block w-1 rounded-sm ${bgClass} ${className}`}
      style={{ height: height || '1.5rem' }}
      aria-hidden="true"
    />
  )
}

export default CeubStem
