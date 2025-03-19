import router from '@adonisjs/core/services/router'

const PurchaseGiftCardsController = async () =>
  await import('#controllers/guest/purchase_gift_cards_controller')

export function renderPaymentSessionRoutes() {
  const prefix = 'payment-session'
  return router
    .group(() => {
      router
        .post('/status-updated', [PurchaseGiftCardsController, 'handlePaymentStatusUpdate'])
        .as('handlePaymentStatusUpdate')
    })
    .prefix(prefix)
}
