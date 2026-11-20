describe('Identidade Visual Institucional e Navegação — CEUB', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renderiza o logotipo oficial do CEUB no cabeçalho e rodapé', () => {
    // Valida logo no cabeçalho
    cy.getByTestId('header-ceub-logo')
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Logotipo CEUB')

    // Valida logo variante branca no rodapé
    cy.getByTestId('footer-ceub-logo')
      .should('be.visible')
  })

  it('exibe e respeita as regras de contraste e as hastes verticais características', () => {
    // Valida presença das hastes da marca no hero
    cy.getByTestId('ceub-dual-stem').should('exist')

    // Valida badge em amarelo com contraste estrito
    cy.getByTestId('badge-design-system')
      .should('be.visible')
      .and('have.class', 'bg-ceub-yellow')
      .and('have.class', 'text-ceub-dark')
  })

  it('permite a navegação responsiva e abertura do menu em dispositivos móveis', () => {
    cy.viewport('iphone-x')
    cy.getByTestId('btn-mobile-menu').should('be.visible').click()
    cy.getByTestId('mobile-nav').should('be.visible')
  })
})
