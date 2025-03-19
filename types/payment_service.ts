import { Request } from '@adonisjs/core/http'
import { Products } from '#types/products'
import { PaymentSession } from '#types/payment_session'
import { Customer } from '#types/customer'

export abstract class PaymentService {
  abstract createPaymentSession(
    products: Products,
    customer: Customer,
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentSession>

  abstract extractPaymentSession(request: Request): Promise<PaymentSession>
}
