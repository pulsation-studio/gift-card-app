import adminConfig from '#config/admin_config'
import { middleware } from '#start/kernel'
import { Role } from '#types/roles'
import router from '@adonisjs/core/services/router'
const AdminAuthController = () => import('./controllers/admin_auth_controller.js')
const ResourceController = () => import('./controllers/resource_controller.js')

export function renderAdminRoutes(prefix: string = 'admin') {
  return router
    .group(() => {
      router
        .group(() => {
          router.get('', [AdminAuthController, 'showAdminLoginView']).as('view')
          router.post('', [AdminAuthController, 'login']).as('submit')
        })
        .use(middleware.guest())
        .as('login')
        .prefix('/login')

      router
        .group(() => {
          router.post('/logout', [AdminAuthController, 'logout']).as('logout')

          router.any('/*', [ResourceController, 'index']).as('resource')
        })
        .use(middleware.auth({ roleRequired: Role.ADMIN }))
        .use(middleware.AdminLayout())

      router.on('').redirectToPath(adminConfig.defaultPath).as('redirect')
    })
    .prefix(prefix)
    .as(prefix)
}
