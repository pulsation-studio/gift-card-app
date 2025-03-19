import router from '@adonisjs/core/services/router'

const PartnerHomeController = async () => await import('#controllers/partner/home_controller')

export function renderPartnerHomeRoute() {
  return router.get('', [PartnerHomeController, 'showPartnerHomeView']).as('home')
}
