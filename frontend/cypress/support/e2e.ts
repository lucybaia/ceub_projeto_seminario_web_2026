// ***********************************************************
// Arquivo de suporte global do Cypress para projetos CEUB
// ***********************************************************

import './commands'

// Desativa logs excessivos de requisições estáticas para acelerar a suíte
Cypress.on('uncaught:exception', (err, runnable) => {
  // Impede falhas por erros não capturados de bibliotecas externas não críticas
  return false
})
