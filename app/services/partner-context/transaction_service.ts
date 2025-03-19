import { GiftCard } from '#models/gift_card'
import { Shop } from '#models/shop'
import { Transaction } from '#models/transaction'
import { ShopService } from '#services/partner-context/shop_service'

import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export class TransactionService {
  private static get context() {
    return HttpContext.getOrFail()
  }

  static async getShopTransactions(shopId: Shop['id']) {
    return Transaction.query()
      .where('shop_id', shopId)
      .preload('partner')
      .preload('giftCard')
      .orderBy('created_at', 'desc')
  }

  static async debitGiftCard(
    giftCard: GiftCard,
    amount: number,
    notes: string | null = null
  ): Promise<Transaction> {
    const partner = this.context.auth.getUserOrFail()
    const shop = await ShopService.getShopFromSession()

    return await db.transaction(async (trx) => {
      const transaction = await Transaction.create(
        {
          amount: amount,
          notes: notes,
          giftCardId: giftCard.id,
          partnerId: partner.id,
          shopId: shop.id,
        },
        { client: trx }
      )

      await giftCard.useTransaction(trx).debit(amount)

      return transaction
    })
  }
}
