import { Order } from '#models/order'
import { Customer } from '#types/customer'
import { PaymentSessionID, PaymentSessionStatus } from '#types/payment_session'

export class OrderService {
  private orderPromise: Promise<Order>

  private constructor(orderPromise: Promise<Order>) {
    this.orderPromise = orderPromise
  }

  static getBySessionId(paymentSessionId: PaymentSessionID) {
    const order = Order.findByOrFail('paymentSessionId', paymentSessionId)
    return new OrderService(order)
  }

  static create(
    paymentSessionId: PaymentSessionID,
    paymentSessionStatus: PaymentSessionStatus,
    customer: Customer
  ) {
    const order = Order.create({
      paymentSessionId,
      status: paymentSessionStatus,
      customerEmail: customer.email,
      customerPhoneNumber: customer.phoneNumber,
    })
    return new OrderService(order)
  }

  updateStatus(paymentSessionStatus: PaymentSessionStatus): this {
    this.orderPromise = this.orderPromise.then((order) => {
      order.status = paymentSessionStatus
      return order.save()
    })
    return this
  }

  loadGiftCards(): this {
    this.orderPromise = this.orderPromise.then(async (order) => {
      await order.load('giftCards')
      return order
    })
    return this
  }

  async do(): Promise<Order> {
    return this.orderPromise
  }
}
