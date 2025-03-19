import router from '@adonisjs/core/services/router'

const ShowGiftCardController = async () =>
  await import('#controllers/partner/show_gift_card_controller')

const DebitGiftCardController = async () =>
  await import('#controllers/partner/debit_gift_card_controller')

export function renderGiftCardRoutes() {
  return router
    .group(() => {
      router.get('', [ShowGiftCardController, 'showGiftCardView']).as('show')

      router
        .group(() => {
          router.get('', [DebitGiftCardController, 'showDebitGiftCardView']).as('view')
          router.post('', [DebitGiftCardController, 'debitGiftCard']).as('submit')
        })
        .prefix('/debit')
        .as('debit')
    })
    .prefix('/gift-card/:giftCardNumber')
    .as('giftCard')
}
