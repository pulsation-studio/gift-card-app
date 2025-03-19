import router from '@adonisjs/core/services/router'

const PartnerAuthController = async () => await import('#controllers/partner/auth_controller')

export function renderPartnerLoginRoutes() {
  const prefix = 'login'
  return router
    .group(() => {
      router.get('', [PartnerAuthController, 'showPartnerLoginView']).as('view')
      router.post('', [PartnerAuthController, 'login']).as('submit')
    })
    .prefix(prefix)
    .as(prefix)
}
