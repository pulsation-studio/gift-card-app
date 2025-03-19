import { GiftCard } from '#models/gift_card'

export class GiftCardService {
  static async findByGiftCardNumberOrFail(giftCardNumber: unknown): Promise<GiftCard> {
    GiftCard.assertGiftCardNumberIsValid(giftCardNumber)

    return GiftCard.findByOrFail('giftCardNumber', giftCardNumber)
  }

  static async findByGiftCardNumber(giftCardNumber: unknown): Promise<GiftCard | null> {
    GiftCard.assertGiftCardNumberIsValid(giftCardNumber)

    return GiftCard.findBy('giftCardNumber', giftCardNumber)
  }
}
