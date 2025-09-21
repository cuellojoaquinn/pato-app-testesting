import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://pato-app-testesting-xi.vercel.app',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    chromeWebSecurity: false,
    experimentalStudio: true,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',

    env: {
      // Variables de entorno para las pruebas
      API_BASE_URL: 'https://pato-app-testesting-xi.vercel.app',
    },
  },
});
