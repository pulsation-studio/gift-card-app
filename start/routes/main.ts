import { renderAdminRoutes } from '#start/routes/admin'
import { renderAPIRoutes } from '#start/routes/api/routes'
import { renderGuestRoutes } from '#start/routes/guest/routes'
import { renderPartnerRoutes } from '#start/routes/partner/routes'
import router from '@adonisjs/core/services/router'
import { renderNewPasswordRoutes } from './new_password.js'

router.on('/server-error').renderInertia('errors/server_error').as('ServerError')

renderPartnerRoutes()
renderGuestRoutes()
renderAPIRoutes()
renderAdminRoutes()
renderNewPasswordRoutes()

router.on('/*').redirect('guest.redirect')
