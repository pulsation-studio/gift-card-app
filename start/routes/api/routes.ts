import router from '@adonisjs/core/services/router'
import { renderPaymentSessionRoutes } from './payment_session.js'

export function renderAPIRoutes() {
  const prefix = 'api'
  return router
    .group(() => {
      renderPaymentSessionRoutes()
    })
    .prefix(prefix)
    .as(prefix)
}
