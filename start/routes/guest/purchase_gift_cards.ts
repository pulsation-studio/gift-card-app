import router from '@adonisjs/core/services/router'

const PurchaseGiftCardsController = async () =>
  await import('#controllers/guest/purchase_gift_cards_controller')

export function renderPurchaseGiftCardsRoutes() {
  return router
    .group(() => {
      router.get('/', [PurchaseGiftCardsController, 'showGiftCardsPurchaseView']).as('form')

      router
        .post('/', [PurchaseGiftCardsController, 'initiatePaymentSession'])
        .as('initiatePaymentSession')

      router
        .get('/success', [PurchaseGiftCardsController, 'showPaymentSuccessView'])
        .as('showPaymentSuccessView')
    })
    .prefix('/gift-card/purchase')
    .as('giftCard.purchase')
}
