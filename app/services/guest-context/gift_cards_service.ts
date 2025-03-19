import { GiftCard } from '#models/gift_card'
import { Order } from '#models/order'

export class GiftCardsService {
  static createGiftCard(order: Order, price: number): Promise<GiftCard> {
    return GiftCard.create({
      startingAmount: price / 100,
      orderId: order.id,
      ownerEmail: order.customerEmail,
      ownerPhoneNumber: order.customerPhoneNumber,
    })
  }
}
