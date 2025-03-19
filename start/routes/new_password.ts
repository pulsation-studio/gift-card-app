import router from '@adonisjs/core/services/router'

const NewPasswordController = async () => await import('#controllers/new_password_controller')

export function renderNewPasswordRoutes() {
  const prefix = 'new-password'
  return router
    .group(() => {
      router.get('/:token', [NewPasswordController, 'view']).as('view')
      router.post('', [NewPasswordController, 'submit']).as('submit')
    })
    .prefix(prefix)
    .as(prefix)
}
