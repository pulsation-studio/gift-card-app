import router from '@adonisjs/core/services/router'

const PartnerShopTransactionsController = async () =>
  await import('#controllers/partner/shop_transaction_controller')

const PartnerShopController = async () => await import('#controllers/partner/shop_controller')

export function renderShopRoutes() {
  const prefix = 'shop'
  return router
    .group(() => {
      router.get('', [PartnerShopController, 'showPartnerShopView']).as('details')
      router
        .get('/transactions', [PartnerShopTransactionsController, 'showShopTransactionsList'])
        .as('transactions')
    })
    .prefix(prefix)
    .as(prefix)
}
