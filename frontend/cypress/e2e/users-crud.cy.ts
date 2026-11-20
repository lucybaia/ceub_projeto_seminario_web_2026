describe('CRUD de Usuários e Gestão de Perfis (RBAC) — Poltrona', () => {
  beforeEach(() => {
    // Acessa diretamente a visualização de gestão de usuários
    cy.visit('/#users')
    cy.getByTestId('table-users').should('be.visible')
  })

  it('1. Renderiza a listagem inicial dos usuários e filtra por perfil (CLIENTE, PORTARIA, GERENTE, ADMIN)', () => {
    // Validação dos KPI cards no topo
    cy.getByTestId('kpi-total-users').should('be.visible').and('not.be.empty')
    cy.getByTestId('kpi-admin-users').should('be.visible')
    cy.getByTestId('kpi-gerente-users').should('be.visible')
    cy.getByTestId('kpi-portaria-users').should('be.visible')
    cy.getByTestId('kpi-cliente-users').should('be.visible')

    // Filtragem por perfil CLIENTE
    cy.getByTestId('filter-perfil').select('CLIENTE')
    cy.getByTestId('table-users').should('contain', 'CLIENTE')
    cy.getByTestId('table-users').should('not.contain', 'ADMIN')

    // Filtragem por perfil GERENTE
    cy.getByTestId('filter-perfil').select('GERENTE')
    cy.getByTestId('table-users').should('contain', 'GERENTE')
    cy.getByTestId('table-users').should('not.contain', 'PORTARIA')

    // Filtragem por perfil PORTARIA
    cy.getByTestId('filter-perfil').select('PORTARIA')
    cy.getByTestId('table-users').should('contain', 'PORTARIA')
    cy.getByTestId('table-users').should('not.contain', 'CLIENTE')

    // Restaurar filtro para todos
    cy.getByTestId('filter-perfil').select('ALL')
    cy.getByTestId('table-users').should('contain', 'Carlos Eduardo Souza')
  })

  it('2. Valida erros com Zod e cria um novo usuário com sucesso', () => {
    cy.getByTestId('btn-new-user').should('be.visible').click()
    cy.getByTestId('user-modal').should('be.visible')

    // Seleciona GERENTE sem preencher dados obrigatórios
    cy.getByTestId('select-user-perfil').select('GERENTE')
    cy.getByTestId('btn-save-user').click()

    // Validações disparadas pelo Zod
    cy.getByTestId('error-user-nome').should('be.visible').and('contain', 'pelo menos 3 caracteres')
    cy.getByTestId('error-user-email').should('be.visible').and('contain', 'endereço de e-mail válido')
    cy.getByTestId('error-user-unidade').should('be.visible').and('contain', 'Vincule uma unidade de cinema')

    // Preenche dados válidos com CPF matematicamente correto
    cy.getByTestId('input-user-nome').type('Juliana Validadora Teste')
    cy.getByTestId('input-user-email').type('juliana.teste@poltrona.com.br')
    cy.getByTestId('select-user-perfil').select('PORTARIA')
    cy.getByTestId('select-user-unidade').select('Poltrona Asa Norte')
    cy.getByTestId('input-user-cpf').type('52998224725')

    cy.getByTestId('btn-save-user').click()

    // Feedback de sucesso
    cy.getByTestId('alert-feedback')
      .should('be.visible')
      .and('contain', 'cadastrado com sucesso')

    // Usuário presente na tabela
    cy.getByTestId('table-users').should('contain', 'Juliana Validadora Teste')
  })

  it('3. Edita o perfil de um usuário existente e reflete imediatamente na tabela', () => {
    // Filtra para encontrar o primeiro usuário
    cy.getByTestId('input-search-users').clear().type('Carlos Eduardo')
    cy.getByTestId('table-users').should('contain', 'Carlos Eduardo Souza')

    // Clica no botão de editar da linha
    cy.get('[data-testid^="btn-edit-user-"]').first().click()
    cy.getByTestId('user-modal').should('be.visible')

    // Altera o nome
    cy.getByTestId('input-user-nome').clear().type('Carlos Eduardo Atualizado')
    cy.getByTestId('btn-save-user').click()

    // Confirma atualização
    cy.getByTestId('alert-feedback')
      .should('be.visible')
      .and('contain', 'atualizado com sucesso')

    cy.getByTestId('table-users').should('contain', 'Carlos Eduardo Atualizado')
  })

  it('4. Exclui um usuário respeitando o fluxo de confirmação da LGPD', () => {
    cy.getByTestId('input-search-users').clear().type('Thiago Faria')
    cy.getByTestId('table-users').should('contain', 'Thiago Faria Albuquerque')

    // Abre modal de exclusão LGPD
    cy.get('[data-testid^="btn-delete-user-"]').first().click()
    cy.getByTestId('delete-user-modal')
      .should('be.visible')
      .and('contain', 'LGPD')

    // Confirma exclusão
    cy.getByTestId('btn-confirm-delete').click()

    // Feedback visual
    cy.getByTestId('alert-feedback')
      .should('be.visible')
      .and('contain', 'excluída conforme diretrizes da LGPD')

    // Verifica que o usuário não existe mais
    cy.getByTestId('empty-users-state').should('exist')
  })

  it('5. Aplica restrições de RBAC ao alternar o perfil simulado', () => {
    // Como ADMIN: botão Novo Usuário deve existir
    cy.getByTestId('btn-new-user').should('be.visible')

    // Alterna para perfil PORTARIA (Apenas leitura/validação)
    cy.getByTestId('btn-role-portaria').click()
    cy.getByTestId('btn-new-user').should('not.exist')
    cy.get('[data-testid^="btn-delete-user-"]').first().should('not.exist')

    // Alterna para perfil CLIENTE (Acesso negado 403 ao painel)
    cy.getByTestId('btn-role-cliente').click()
    cy.getByTestId('access-denied-view')
      .should('be.visible')
      .and('contain', '403 — Acesso Restrito')

    // Retorna para ADMIN
    cy.getByTestId('btn-switch-to-admin').click()
    cy.getByTestId('session-simulator-bar').should('be.visible')
    cy.getByTestId('btn-new-user').should('be.visible')
  })
})
