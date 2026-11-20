import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ceub: {
          // Paleta Oficial Institucional CEUB
          dark: '#43054e',       // Roxo-Escuro: Primária, cabeçalhos, textos de alto contraste, fundos de destaque e rodapés
          purple: '#662c92',     // Roxo: Secundária, containers, cards de apoio e estados intermediários
          lilac: '#bf0087',      // Lilás: Detalhes gráficos (hastes do logo), badges, bordas ativas e ícones
          magenta: '#ec0089',    // Magenta: CTAs (botões de ação), estados de hover, links ativos e conversão
          yellow: '#fde100',     // Amarelo: Pontos de atenção, alertas positivos, tags de destaque (SEMPRE com texto dark)
          
          // Neutros e Superfícies
          surface: {
            DEFAULT: '#ffffff',
            subtle: '#f8f7fa',
            muted: '#e5e2ea',
            dark: '#1f1624',
          },
        },
      },
      fontFamily: {
        sans: ['"dT Jakob"', '"Plus Jakarta Sans"', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['"dT Jakob"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'ceub-sm': '0 1px 2px 0 rgba(67, 5, 78, 0.05)',
        'ceub-md': '0 4px 6px -1px rgba(67, 5, 78, 0.08), 0 2px 4px -1px rgba(67, 5, 78, 0.04)',
        'ceub-lg': '0 10px 15px -3px rgba(67, 5, 78, 0.1), 0 4px 6px -2px rgba(67, 5, 78, 0.05)',
        'ceub-glow-magenta': '0 0 15px rgba(236, 0, 137, 0.35)',
        'ceub-glow-yellow': '0 0 15px rgba(253, 225, 0, 0.4)',
      },
      borderRadius: {
        'ceub-sm': '0.375rem',
        'ceub-md': '0.5rem',
        'ceub-lg': '0.75rem',
        'ceub-xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
