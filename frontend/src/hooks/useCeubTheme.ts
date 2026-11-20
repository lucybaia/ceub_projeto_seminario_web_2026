export const ceubColors = {
  dark: '#43054e',       // Roxo-Escuro primário institucional
  purple: '#662c92',     // Roxo secundário
  lilac: '#bf0087',      // Lilás das hastes do logo e detalhes
  magenta: '#ec0089',    // Magenta dos botões CTA
  yellow: '#fde100',     // Amarelo para pontos de atenção e badges
  surface: {
    white: '#ffffff',
    subtle: '#f8f7fa',
    muted: '#e5e2ea',
    dark: '#1f1624',
  },
} as const

export type CeubColorKey = keyof typeof ceubColors

/**
 * Hook para consumo programático dos tokens e regras de acessibilidade da marca CEUB.
 */
export function useCeubTheme() {
  const getAccessibleTextColor = (bgColor: 'yellow' | 'dark' | 'purple' | 'lilac' | 'magenta') => {
    // Regra institucional estrita: em amarelo (#fde100) o texto DEVE ser escuro (#43054e)
    if (bgColor === 'yellow') {
      return ceubColors.dark
    }
    return '#ffffff'
  }

  return {
    colors: ceubColors,
    getAccessibleTextColor,
    isDarkHeader: true,
  }
}

export default useCeubTheme
