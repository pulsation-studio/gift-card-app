import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

import { renderPartnerLoginRoutes } from '../partner/login.js'
import { Role } from '#types/roles'
import { renderGiftCardRoutes } from './gift_card.js'
import { renderPartnerLogoutRoute } from './logout.js'
import { renderPartnerHomeRoute } from './home.js'
import { renderPartnerAccountRoute } from './account.js'
import { renderShopRoutes } from './shop.js'
import { renderPartnerForgotPasswordRoutes } from './forgot_password.js'

export function renderPartnerRoutes() {
  const prefix = 'partner'
  return router
    .group(() => {
      router
        .group(() => {
          renderPartnerHomeRoute()
          renderPartnerAccountRoute()
          renderPartnerLogoutRoute()

          renderShopRoutes()
          renderGiftCardRoutes()
        })
        .use(middleware.auth({ roleRequired: Role.PARTNER }))
        .use(middleware.partnerLayout())

      router
        .group(() => {
          renderPartnerLoginRoutes()
          renderPartnerForgotPasswordRoutes()
        })
        .use(middleware.guest())

      router.on('/*').redirect('partner.home').as('redirect')
    })
    .prefix(prefix)
    .as(prefix)
}
