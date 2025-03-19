import { GiftCards } from '#models/gift_card'
import { Order } from '#models/order'
import { Product, Products } from '#types/products'
import { GiftCardsService } from '#services/guest-context/gift_cards_service'

export class ProductToGiftCardAdapter {
  static async productsToGiftCards(products: Products, order: Order): Promise<GiftCards> {
    const splitedGiftCards = await Promise.all(
      products.map((product) => this.productToGiftCards(product, order))
    )
    const joinedGiftCards = splitedGiftCards.reduce(
      (allGiftCards, partialGiftCards) => allGiftCards.concat(partialGiftCards),
      [] as GiftCards
    )
    return joinedGiftCards
  }

  static productToGiftCards(product: Product, order: Order): Promise<GiftCards> {
    const giftCards = Array.from({ length: product.quantity }, () =>
      GiftCardsService.createGiftCard(order, product.price)
    )

    return Promise.all(giftCards)
  }
}
