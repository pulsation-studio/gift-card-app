import { Transaction } from '#models/transaction'
import BaseModelDto from '#types/base_model_dto'

export class TransactionService {
  static async getTransactionsWithRelationShips(): Promise<Transaction[]> {
    const transactions = await Transaction.query()
      .preload('giftCard')
      .preload('partner')
      .preload('shop')
      .orderBy('created_at', 'desc')

    return transactions
  }

  static async serializeTransaction(transactions: InstanceType<typeof Transaction>[]) {
    return transactions.map((transaction) => new TransactionSerializer(transaction).serialize())
  }
}

class TransactionSerializer extends BaseModelDto<Transaction> {
  serialize(): object {
    return {
      id: this.model.id,
      createdAt: this.model.createdAt,
      amount: this.model.amount,
      notes: this.model.notes,
      partner: {
        fullName: this.model.partner?.fullName,
      },
      shop: {
        name: this.model.shop?.name,
      },
      giftCard: {
        formattedGiftCardNumber: this.model.giftCard?.formattedGiftCardNumber,
      },
    }
  }
}
