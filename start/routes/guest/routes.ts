import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { renderPurchaseGiftCardsRoutes } from './purchase_gift_cards.js'

export function renderGuestRoutes() {
  return router
    .group(() => {
      renderPurchaseGiftCardsRoutes()

      router.on('/guest').redirect('guest.giftCard.purchase.form').as('redirect')
    })
    .use(middleware.guestLayout())
    .as('guest')
}
