import React from 'react'

export interface CeubLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
}

const sizeMap = {
  sm: 'h-7 w-auto',
  md: 'h-9 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
  auto: '',
}

export const CeubLogo: React.FC<CeubLogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const isWhite = variant === 'white'
  const letterColor = isWhite ? '#ffffff' : '#43054e' // Branco ou ceub-dark (#43054e)
  const stemColor = '#bf0087' // Haste vertical característica em ceub-lilac (#bf0087)

  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} ${className}`.trim()}
      role="img"
      aria-label="Logotipo CEUB"
      {...props}
    >
      {/* Haste Superior: barra vertical assimétrica característica (Lilás #bf0087) */}
      <rect
        x="146"
        y="0"
        width="14"
        height="42"
        rx="1.5"
        fill={stemColor}
      />

      {/* Haste Inferior: barra vertical assimétrica inferior (Lilás #bf0087) */}
      <rect
        x="166"
        y="78"
        width="14"
        height="42"
        rx="1.5"
        fill={stemColor}
      />

      {/* Letra C */}
      <path
        d="M52 35 C45 31 38 30 30 30 C13 30 0 43 0 60 C0 77 13 90 30 90 C39 90 46 88 52 84 L48 72 C43 75 37 77 30 77 C20 77 13 69 13 60 C13 51 20 43 30 43 C37 43 43 45 48 48 Z"
        fill={letterColor}
      />

      {/* Letra E */}
      <path
        d="M58 31 H94 V44 H72 V53 H91 V66 H72 V77 H95 V90 H58 Z"
        fill={letterColor}
      />

      {/* Letra U */}
      <path
        d="M102 31 H115 V65 C115 73 120 78 128 78 C136 78 141 73 141 65 V31 H154 V65 C154 81 143 90 128 90 C113 90 102 81 102 65 Z"
        fill={letterColor}
      />

      {/* Letra B */}
      <path
        d="M160 31 H184 C195 31 204 36 204 46 C204 53 199 58 192 60 C201 62 206 67 206 75 C206 85 197 90 184 90 H160 Z M173 43 V54 H183 C187 54 191 52 191 48 C191 45 187 43 183 43 Z M173 66 V78 H184 C189 78 193 76 193 72 C193 68 189 66 184 66 Z"
        fill={letterColor}
      />
    </svg>
  )
}

export default CeubLogo
