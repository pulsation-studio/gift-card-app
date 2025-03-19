import { handleUnknownError } from '#helpers/handle_unknown_error'
import { Order } from '#models/order'
import { GiftCardsService } from '#services/gift_card_service'
import { OrderService } from '#services/guest-context/order_service'
import { ProductToGiftCardAdapter } from '#services/guest-context/product_to_gift_card_adapter'
import BaseModelDto from '#types/base_model_dto'
import { Customer } from '#types/customer'
import { PaymentService } from '#types/payment_service'
import { PaymentSession } from '#types/payment_session'
import { Product } from '#types/products'
import { createGiftCardValidator } from '#validators/gift_card'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

@inject()
export default class PurchaseGiftCardsController {
  constructor(private paymentService: PaymentService) {}

  public async showGiftCardsPurchaseView({ inertia, response }: HttpContext) {
    try {
      return inertia.render('guest/purchase_gift_cards', {
        initiatingPaymentSessionPath: router.makeUrl(
          'guest.giftCard.purchase.initiatePaymentSession'
        ),
      })
    } catch (error) {
      logger.error(error)
      handleUnknownError(error, "Erreur lors du chargement de la vue de d'achat de carte-cadeau")

      return response.redirect().toRoute('ServerError')
    }
  }

  public async initiatePaymentSession({ request, inertia, response }: HttpContext) {
    const payload = await request.validateUsing(createGiftCardValidator)
    try {
      const product: Product = {
        name: `${+payload.cardQuantity !== 1 ? 'Cartes-cadeaux' : 'Carte-cadeau'}`,
        price: Number(payload.cardPrice),
        quantity: Number(payload.cardQuantity),
      }
      const customer: Customer = {
        email: payload.email,
        phoneNumber: payload.phoneNumber ? payload.phoneNumber : undefined,
      }

      const BASE_URL = `${request.protocol()}://${request.host()}`
      const paymentSession: PaymentSession = await this.paymentService.createPaymentSession(
        [product],
        customer,
        BASE_URL + router.makeUrl('guest.giftCard.purchase.showPaymentSuccessView'),
        BASE_URL + router.makeUrl('guest.giftCard.purchase.form')
      )

      paymentSession.assertUrlIsValid()

      await OrderService.create(paymentSession.id, paymentSession.status, customer).do()

      return inertia.location(paymentSession.url)
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, "Erreur lors de la création d'une session de paiement")

      return response.redirect().toRoute('guest.giftCard.purchase.form')
    }
  }

  public async showPaymentSuccessView({ request, inertia, response }: HttpContext) {
    try {
      const sessionId = request.qs().session_id

      if (!sessionId) {
        throw new Error('Error missing session_id query in url')
      }

      const order = await OrderService.getBySessionId(sessionId).do()

      return inertia.render('guest/show_payment_success', {
        order: new OrderDto(order).serialize(),
        buyMoreGiftCardsPath: router.makeUrl('guest.giftCard.purchase.form'),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement de la vue de confirmation de paiement.')

      return response.redirect().toRoute('ServerError')
    }
  }

  public async handlePaymentStatusUpdate({ request, response }: HttpContext) {
    try {
      const paymentSession: PaymentSession =
        await this.paymentService.extractPaymentSession(request)
      const order = await OrderService.getBySessionId(paymentSession.id)
        .updateStatus(paymentSession.status)
        .loadGiftCards()
        .do()

      if (order.isPaid && !order.paymentEmailSent) {
        paymentSession.assertProducts()

        const giftCards = await ProductToGiftCardAdapter.productsToGiftCards(
          paymentSession.products,
          order
        )

        await GiftCardsService.sendByMail(order.customerEmail, giftCards, paymentSession.invoice)
      }

      return response.status(200).json({ received: true })
    } catch (error) {
      logger.error(error)
      return response.status(500)
    }
  }
}

class OrderDto extends BaseModelDto<Order> {
  serialize() {
    return {
      orderNumber: this.model.orderNumber,
    }
  }
}
