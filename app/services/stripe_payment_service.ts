import env from '#start/env'
import Stripe from 'stripe'
import SettingsService from '#services/settings_service'
import { Request } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#types/payment_service'
import logger from '@adonisjs/core/services/logger'
import PaymentSessionException from '#exceptions/payment_session_exception'
import { Products } from '#types/products'
import {
  Invoice,
  PaymentSession,
  PaymentSessionID,
  PaymentSessionStatus,
} from '#types/payment_session'
import { Customer } from '#types/customer'

@inject()
export class StripePaymentService extends PaymentService {
  private stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))

  public async createPaymentSession(
    products: Products,
    customer: Customer,
    successUrl: string,
    cancelUrl: string
  ) {
    logger.info(`Creating new payment session...`)
    const settings = await SettingsService.getAll()

    const stripeProducts: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(
      (product) => ({
        price_data: {
          currency: settings.global.paymentCurrency,
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })
    )

    const stripeSession = await this.stripe.checkout.sessions.create({
      customer_email: customer.email,
      line_items: stripeProducts,
      mode: 'payment',
      success_url: this.addSessionIdQueryParam(successUrl),
      cancel_url: cancelUrl,
      payment_intent_data: {
        receipt_email: customer.email,
        description: 'Merci pour votre achat!',
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Merci pour votre achat!',
        },
      },
    })

    const paymentSessionStatus = this.determineStatus(stripeSession)
    const paymentSession = new PaymentSession(stripeSession.id, paymentSessionStatus)
      .setUrl(stripeSession.url)
      .setProducts(products)

    logger.info('Payment session successfully created!')
    return paymentSession
  }

  public async extractPaymentSession(request: Request): Promise<PaymentSession> {
    logger.info(`Payment session recovering...`)

    const stripeSession = this.extractStripeSession(request)
    const status = this.determineStatus(stripeSession)
    const products = await this.retrieveProducts(stripeSession.id)
    const invoice = await this.retrieveInvoice(stripeSession)

    const paymentSession = new PaymentSession(stripeSession.id, status)
      .setProducts(products)
      .setInvoice(invoice)
    logger.info('Payment session successfully recovered!')
    return paymentSession
  }

  private extractStripeSession(request: Request): Stripe.Checkout.Session {
    const signature = request.headers()['stripe-signature']
    const body = request.raw()
    const secret = env.get('STRIPE_WEBHOOK_SECRET_KEY')

    this.assertBodyIsValid(body)
    this.assertSignatureIsValid(signature)

    const event = this.stripe.webhooks.constructEvent(body, signature, secret)

    this.assertEventIsValid(event.type)

    const stripeSession = event.data.object
    return stripeSession
  }

  private async retrieveProducts(sessionId: PaymentSessionID) {
    const lineItemsResponse = await this.stripe.checkout.sessions.listLineItems(sessionId)
    const lineItems = lineItemsResponse.data

    const products = this.extractProducts(lineItems)

    return products
  }

  private async retrieveInvoice(stripeSession: Stripe.Checkout.Session): Promise<Invoice | null> {
    const stripeInvoice = stripeSession.invoice
    let invoiceUrl: string | null | undefined

    if (stripeInvoice) {
      if (typeof stripeInvoice === 'string') {
        const retrievedInvoice = await this.stripe.invoices.retrieve(stripeInvoice)
        invoiceUrl = retrievedInvoice.hosted_invoice_url
      } else {
        invoiceUrl = stripeInvoice.hosted_invoice_url
      }

      if (invoiceUrl) {
        return { invoiceUrl: invoiceUrl }
      }
    }
    return null
  }

  private assertBodyIsValid(body: unknown): asserts body is string {
    if (typeof body !== 'string')
      throw new PaymentSessionException('Request body invalid for read PaymentSession')
  }
  private assertSignatureIsValid(signature: unknown): asserts signature is string {
    if (typeof signature !== 'string')
      throw new PaymentSessionException('Request signature invalid for read PaymentSession.')
  }
  private assertEventIsValid(
    eventType: unknown
  ): asserts eventType is 'checkout.session.completed' | 'checkout.session.expired' {
    if (eventType !== 'checkout.session.completed' && eventType !== 'checkout.session.expired')
      throw new PaymentSessionException(`Unhandled event type: ${eventType}`)
  }

  private addSessionIdQueryParam(success_url: string): string {
    return success_url + '?session_id={CHECKOUT_SESSION_ID}'
  }

  private extractProducts(lineItems: Stripe.LineItem[]): Products {
    // Faire une factory ?
    const products: Products = lineItems.map((lineItem) => {
      if (
        lineItem.amount_subtotal === null ||
        lineItem.quantity === null ||
        lineItem.description === undefined
      ) {
        throw new PaymentSessionException(
          'Cannot retrieve product data from Stripe.Checkout.Session'
        )
      }

      return {
        price: lineItem.amount_subtotal / lineItem.quantity,
        quantity: lineItem.quantity,
        name: lineItem.description,
      }
    })

    return products
  }

  // TODO : amélioration de la DX possible , cf matis
  private determineStatus(stripeSession: Stripe.Checkout.Session): PaymentSessionStatus {
    switch (stripeSession.status) {
      case 'expired':
        return PaymentSessionStatus.Canceled

      case 'complete':
        switch (stripeSession.payment_status) {
          case 'paid':
          case 'no_payment_required':
            return PaymentSessionStatus.Paid
          case 'unpaid':
          default:
            return PaymentSessionStatus.Canceled
        }
      case 'open':
        switch (stripeSession.payment_status) {
          case 'paid':
          case 'no_payment_required':
            return PaymentSessionStatus.Paid
          case 'unpaid':
          default:
            return PaymentSessionStatus.Pending
        }
      default:
        return PaymentSessionStatus.Pending
    }
  }
}
