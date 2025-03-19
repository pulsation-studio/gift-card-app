import router from '@adonisjs/core/services/router'

const PartnerAuthController = async () => await import('#controllers/partner/auth_controller')

export function renderPartnerLogoutRoute() {
  return router.post('/logout', [PartnerAuthController, 'logout']).as('logout')
}
