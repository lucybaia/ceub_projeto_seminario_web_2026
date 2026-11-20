import React, { useState } from 'react'
import CeubLogo from '../components/brand/CeubLogo'
import CeubStem from '../components/brand/CeubStem'
import Button from '../components/ui/Button'
import { Menu, X, Users, Home } from 'lucide-react'

export interface HeaderProps {
  currentView: 'home' | 'users'
  onNavigate: (view: 'home' | 'users') => void
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-ceub-surface-muted transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo Oficial CEUB + Nome Poltrona */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-ceub-purple rounded-sm"
              aria-label="Ir para a página inicial"
            >
              <CeubLogo size="md" data-testid="header-ceub-logo" />
              <div className="hidden sm:flex flex-col text-left pl-3 border-l border-ceub-surface-muted">
                <span className="text-xs font-bold uppercase tracking-widest text-ceub-magenta">
                  Poltrona Cinema
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  auth-service & RBAC
                </span>
              </div>
            </button>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4" aria-label="Menu Principal">
            <button
              onClick={() => onNavigate('home')}
              data-testid="nav-link-home"
              className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'text-ceub-dark font-bold'
                  : 'text-gray-600 hover:text-ceub-magenta'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início Institucional</span>
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-ceub-lilac rounded-full" />
              )}
            </button>

            <button
              onClick={() => onNavigate('users')}
              data-testid="nav-link-users"
              className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                currentView === 'users'
                  ? 'text-ceub-dark font-bold'
                  : 'text-gray-600 hover:text-ceub-magenta'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestão de Usuários (RBAC)</span>
              {currentView === 'users' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-ceub-lilac rounded-full" />
              )}
            </button>
          </nav>

          {/* CTA Superior */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={currentView === 'users' ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onNavigate(currentView === 'users' ? 'home' : 'users')}
              data-testid="btn-header-cta"
            >
              {currentView === 'users' ? 'Ver Portal' : 'Acessar Gestão RBAC'}
            </Button>
          </div>

          {/* Botão Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="btn-mobile-menu"
              className="p-2 text-ceub-dark hover:text-ceub-magenta rounded-md focus:outline-none focus:ring-2 focus:ring-ceub-purple"
              aria-label="Alternar Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div data-testid="mobile-nav" className="md:hidden border-t border-ceub-surface-muted bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onNavigate('home')
              setMobileMenuOpen(false)
            }}
            data-testid="mobile-link-home"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-base text-left ${
              currentView === 'home'
                ? 'bg-ceub-surface-subtle text-ceub-dark font-bold'
                : 'text-gray-700 hover:bg-ceub-surface-subtle hover:text-ceub-magenta'
            }`}
          >
            {currentView === 'home' && <CeubStem variant="indicator" color="lilac" height="1rem" />}
            <Home className="w-4 h-4" />
            <span>Início Institucional</span>
          </button>

          <button
            onClick={() => {
              onNavigate('users')
              setMobileMenuOpen(false)
            }}
            data-testid="mobile-link-users"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-base text-left ${
              currentView === 'users'
                ? 'bg-ceub-surface-subtle text-ceub-dark font-bold'
                : 'text-gray-700 hover:bg-ceub-surface-subtle hover:text-ceub-magenta'
            }`}
          >
            {currentView === 'users' && <CeubStem variant="indicator" color="lilac" height="1rem" />}
            <Users className="w-4 h-4" />
            <span>Gestão de Usuários (RBAC)</span>
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
