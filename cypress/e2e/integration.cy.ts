describe('Pruebas de integración', () => {
  it('Reproducción de sonido del pato', () => {
    cy.visit('https://pato-app-testesting-xi.vercel.app/')
    
    // Presionamos el botón de inicio de sesión
    cy.get('.border').click();
    
    // Ingresamos el email y contraseña
    cy.get('#email').type('juan@example.com');
    cy.get('#contraseña').type('123456');
    
    // Presionamos el botón de inicio de sesión
    cy.get('.inline-flex').click();
    
    // Navegar a catalogo
    cy.get('.inline-flex.bg-primary').click();
    
    // Click en el componente usando XPath
    cy.xpath('/html/body/main/div/div[2]/div/button').click();
    
    // Seleccionar la cuarta opción del selector desplegado
    // Esperar a que el dropdown se abra y luego seleccionar la cuarta opción
    cy.get('[data-radix-collection-item]').eq(3).click();
    
    cy.get('.flex-1 .border.w-full').click();
    
    // Ejecucion sonido del pato
    cy.get('.text-sm.w-full').click();
    
    // Cierre de sesion
    cy.get('.text-sm.text-white').click();
    cy.get('.min-h-screen').click();
  });

  it.only('Cuenta premium', function() {
    cy.visit('https://pato-app-testesting-xi.vercel.app/')
    cy.get('.border').click();
    
    // Login de cuenta
    cy.get('#email').type('maria@example.com{enter}');
    cy.get('#contraseña').type('123456');
    cy.get('.inline-flex').click();
    
    // Seleccion actualizar Plan
    cy.get('.text-sm.w-full').last().click();
    cy.wait(1000)
    
    // Seleccionar Plan Premium
    cy.get('.text-sm.w-full').click();
    cy.wait(1000)
    
    // Selecciona plan semestral
    cy.get('.relative .text-sm.rounded-md.w-full').click();
    
    // Selecciona pago con tarjeta credito
    cy.get('.inline-flex.bg-primary').click();
    
    // Completar campos tarjeta
    cy.get('#cardNumber').type('1234 5678 1234 5678');
    cy.get('#cardName').type('Maria Perez');
    cy.get('#expiry').type('20/12');
    cy.get('#cvv').type('132');
    cy.get('.space-y-4 > .shadow-xs.w-full').click();
    cy.wait(1000);
    
    // Corroborar plan premium
    cy.get('[href="/plan"]')
      .should('have.text', 'Mi Plan (pago)');
    cy.get('.text-xl.font-bold').click();
    cy.get('div:nth-child(2) > .grid > .text-muted-foreground').should('have.text', 'Plan actual: Premium');
  });
})