// ***********************************************************
// Comandos customizados do Cypress padronizados para o CEUB
// ***********************************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Localiza elemento pelo atributo semântico data-testid
       * @example cy.getByTestId('btn-submit-lead')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

export {}
