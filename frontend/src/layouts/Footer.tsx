import React from 'react'
import CeubLogo from '../components/brand/CeubLogo'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-ceub-dark text-white mt-auto border-t-4 border-ceub-lilac">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Marca Institucional */}
          <div className="space-y-4 md:col-span-1">
            <CeubLogo variant="white" size="md" data-testid="footer-ceub-logo" />
            <p className="text-sm text-ceub-surface-muted/90 leading-relaxed">
              CEUB — Centro Universitário de Brasília. Tradição em excelência acadêmica, inovação e pesquisa.
            </p>
          </div>

          {/* Coluna 2: Campus & Contato */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ceub-yellow mb-4">
              Campi
            </h4>
            <ul className="space-y-2 text-sm text-ceub-surface-muted/80">
              <li>Campus Asa Norte (SEPN 707/907)</li>
              <li>Campus Taguatinga (QS 1)</li>
              <li className="pt-2 text-white font-medium">Central de Atendimento: (61) 3966-1201</li>
            </ul>
          </div>

          {/* Coluna 3: Links Institucionais */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ceub-yellow mb-4">
              Institucional
            </h4>
            <ul className="space-y-2 text-sm text-ceub-surface-muted/80">
              <li><a href="https://institucional.uniceub.br" className="hover:text-ceub-yellow transition-colors">Portal Institucional</a></li>
              <li><a href="https://institucional.uniceub.br/central-da-marca" className="hover:text-ceub-yellow transition-colors">Central da Marca</a></li>
              <li><a href="#" className="hover:text-ceub-yellow transition-colors">Pesquisa e Iniciação Científica</a></li>
              <li><a href="#" className="hover:text-ceub-yellow transition-colors">Biblioteca Digital</a></li>
            </ul>
          </div>

          {/* Coluna 4: Padrão Digital & Segurança */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ceub-yellow mb-4">
              Padrão Digital
            </h4>
            <p className="text-sm text-ceub-surface-muted/80 leading-relaxed mb-3">
              Desenvolvido com o Design System Oficial do CEUB para a web.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-ceub-yellow" />
              <span>Padrão Web 2026</span>
            </div>
          </div>
        </div>

        {/* Linha Divisória com haste gráfica */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-ceub-surface-muted/70 gap-4">
          <p>© {new Date().getFullYear()} CEUB — Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            <span>Privacidade & Termos</span>
            <span>•</span>
            <span>Acessibilidade Digital</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
