import router from '@adonisjs/core/services/router'

const ForgotPasswordController = async () =>
  await import('#controllers/partner/forgot_password_controller')

export function renderPartnerForgotPasswordRoutes() {
  const prefix = 'forgot-password'
  return router
    .group(() => {
      router.get('', [ForgotPasswordController, 'view']).as('view')
      router.post('', [ForgotPasswordController, 'submit']).as('submit')
    })
    .prefix(prefix)
    .as(prefix)
}
