import router from '@adonisjs/core/services/router'

const PartnerAccountController = async () => await import('#controllers/partner/account_controller')

export function renderPartnerAccountRoute() {
  const prefix = 'account'
  return router
    .group(() => {
      router.get('', [PartnerAccountController, 'showPartnerAccountView']).as('view')
      router
        .post('/reset-password', [PartnerAccountController, 'resetPassword'])
        .as('resetPassword')
    })
    .prefix(prefix)
    .as(prefix)
}
