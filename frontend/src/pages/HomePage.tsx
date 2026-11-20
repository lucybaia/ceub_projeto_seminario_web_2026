import React from 'react'
import CeubLogo from '../components/brand/CeubLogo'
import CeubStem from '../components/brand/CeubStem'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import InstitutionalLeadForm from '../components/ui/InstitutionalLeadForm'
import { ArrowRight, Layers, Lock, CheckCircle } from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Section Institucional */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ceub-surface-subtle via-white to-white py-16 lg:py-24 border-b border-ceub-surface-muted">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Conteúdo Principal do Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="yellow" dot data-testid="badge-design-system">
                  Design System Oficial CEUB
                </Badge>
                <Badge variant="lilac">
                  React 18 + Vite + Tailwind
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                <span data-testid="ceub-dual-stem">
                  <CeubStem variant="dual" color="lilac" height="2.5rem" className="mt-2 shrink-0 hidden sm:inline-flex" />
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ceub-dark tracking-tight leading-tight">
                  Inovação, Tradição e Excelência Acadêmica
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-gray-700 font-normal leading-relaxed max-w-2xl">
                Template padrão frontend para o desenvolvimento de aplicações web institucionais do CEUB,
                respeitando os padrões cromáticos, acessibilidade estrita, segurança cibernética e testes Cypress.
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                  Começar Projeto
                </Button>
                <Button variant="outline" size="lg">
                  Guia da Marca
                </Button>
              </div>
            </div>

            {/* Card de Apresentação Visual da Marca */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-ceub-dark text-white rounded-ceub-xl p-8 shadow-ceub-lg border border-ceub-purple/50">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="yellow">Acessível WCAG</Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <CeubLogo variant="white" size="lg" />
                    <p className="text-xs text-ceub-surface-muted mt-2">
                      Padrão Digital Institucional 2026
                    </p>
                  </div>

                  {/* Demonstração dos Tokens de Cores */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-ceub-yellow uppercase tracking-wider">
                      Paleta Digital Oficial
                    </span>
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      <div className="h-10 rounded-ceub-sm bg-ceub-dark border border-white/20 flex items-center justify-center text-[10px] text-white">#43054e</div>
                      <div className="h-10 rounded-ceub-sm bg-ceub-purple flex items-center justify-center text-[10px] text-white">#662c92</div>
                      <div className="h-10 rounded-ceub-sm bg-ceub-lilac flex items-center justify-center text-[10px] text-white">#bf0087</div>
                      <div className="h-10 rounded-ceub-sm bg-ceub-magenta flex items-center justify-center text-[10px] text-white">#ec0089</div>
                      <div className="h-10 rounded-ceub-sm bg-ceub-yellow flex items-center justify-center text-[10px] text-ceub-dark font-bold">#fde100</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/10 rounded-ceub-md text-xs text-ceub-surface-muted">
                    <p className="font-semibold text-white">Regra de Contraste:</p>
                    <p className="mt-0.5">Elementos amarelos utilizam obrigatoriamente tipografia em tom escuro institucional (<code className="text-ceub-yellow">#43054e</code>).</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seção com Formulário Institucional Validado com Zod */}
      <section className="py-16 bg-ceub-surface-subtle border-b border-ceub-surface-muted">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="magenta">Validação com Zod + Testes Cypress</Badge>
            <h2 className="text-3xl font-bold text-ceub-dark tracking-tight mt-2">
              Formulário e Validações Seguras
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Demonstração de validação de schemas em runtime com Zod e cobertura E2E automatizada.
            </p>
          </div>

          <InstitutionalLeadForm />
        </div>
      </section>

      {/* Grid de Componentes e Diretrizes */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-ceub-dark tracking-tight">
              Componentes & Segurança Integrados
            </h2>
            <p className="text-gray-600 mt-2">
              Padronizados para React 18, TypeScript estrito, Tailwind CSS e testes Cypress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card stemAccent="stem-left" interactive>
              <CardHeader>
                <div className="p-2 bg-ceub-surface-subtle rounded-md text-ceub-purple">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="lilac">Componentes</Badge>
              </CardHeader>
              <CardTitle>Identidade & Hastes</CardTitle>
              <CardDescription>
                Componentes de marca como <code className="text-xs bg-ceub-surface-subtle px-1 py-0.5 rounded">&lt;CeubLogo /&gt;</code> e <code className="text-xs bg-ceub-surface-subtle px-1 py-0.5 rounded">&lt;CeubStem /&gt;</code> reproduzem a geometria e proporções oficiais da marca.
              </CardDescription>
            </Card>

            <Card stemAccent="stem-top" interactive>
              <CardHeader>
                <div className="p-2 bg-ceub-surface-subtle rounded-md text-ceub-magenta">
                  <Lock className="w-5 h-5" />
                </div>
                <Badge variant="magenta">Segurança</Badge>
              </CardHeader>
              <CardTitle>Zero Secrets & Sanitização</CardTitle>
              <CardDescription>
                Proteção estrita contra XSS (via Zod e DOMPurify), sessões seguras em cookies HttpOnly e zero sourcemaps em produção.
              </CardDescription>
            </Card>

            <Card stemAccent="stem-left" interactive>
              <CardHeader>
                <div className="p-2 bg-ceub-surface-subtle rounded-md text-ceub-dark">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <Badge variant="yellow">Cypress E2E</Badge>
              </CardHeader>
              <CardTitle>Testes Automatizados</CardTitle>
              <CardDescription>
                Suíte completa com Cypress, interceptação de rede <code className="text-xs font-semibold">cy.intercept</code> com fixtures e seletores semânticos.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
