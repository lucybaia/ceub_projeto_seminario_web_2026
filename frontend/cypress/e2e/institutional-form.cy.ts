describe('Formulário Institucional e Validações Zod — CEUB', () => {
  beforeEach(() => {
    // Interceptação com fixture mockada: velocidade e determinismo sem backend ativo
    cy.intercept('POST', '**/api/leads', {
      statusCode: 201,
      fixture: 'lead-success.json',
    }).as('submitLead')

    cy.visit('/')
  })

  it('bloqueia o envio e exibe mensagens de erro em tempo real com Zod', () => {
    // Tenta submeter o formulário vazio
    cy.getByTestId('btn-submit-lead').click()

    // Validações disparadas pelo Zod
    cy.getByTestId('error-fullName')
      .should('be.visible')
      .and('contain', 'pelo menos 3 caracteres')

    cy.getByTestId('error-email')
      .should('be.visible')
      .and('contain', 'e-mail institucional ou pessoal válido')

    cy.getByTestId('error-acceptTerms')
      .should('be.visible')
      .and('contain', 'política de privacidade')
  })

  it('envia os dados com sucesso ao preencher o formulário corretamente', () => {
    // Preenchimento com dados válidos
    cy.getByTestId('input-fullName').type('Mariana Vasconcelos')
    cy.getByTestId('input-email').type('mariana.vasconcelos@ceub.edu.br')
    cy.getByTestId('input-phone').type('61 99123-4567')
    cy.getByTestId('select-course').select('Ciência da Computação')
    cy.getByTestId('checkbox-terms').check()

    cy.getByTestId('btn-submit-lead').click()

    // Aguarda o intercept mockado
    cy.wait('@submitLead').its('request.body').should('deep.include', {
      fullName: 'Mariana Vasconcelos',
      email: 'mariana.vasconcelos@ceub.edu.br',
      courseInterest: 'Ciência da Computação',
      acceptTerms: true,
    })

    // Feedback visual de sucesso
    cy.getByTestId('alert-lead-success')
      .should('be.visible')
      .and('contain', 'Inscrição realizada com sucesso')
  })
})
