import { handleUnknownError } from '#helpers/handle_unknown_error'
import { Transaction } from '#models/transaction'
import { ShopService } from '#services/partner-context/shop_service'
import { TransactionService } from '#services/partner-context/transaction_service'
import BaseModelDto from '#types/base_model_dto'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class PartnerShopTransactionsController {
  public async showShopTransactionsList({ inertia, response }: HttpContext) {
    try {
      const shop = await ShopService.getShopFromSession()
      const transactions = await TransactionService.getShopTransactions(shop.id)

      const transactionsDto = TransactionDto.serializeAll(transactions)

      return inertia.render('partner/transaction_list', {
        transactions: transactionsDto,
        shopPath: router.makeUrl('partner.shop.details'),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement des transactions de la boutique')
      return response.redirect().toRoute('partner.shop')
    }
  }
}

class TransactionDto extends BaseModelDto<Transaction> {
  serialize() {
    return {
      id: this.model.id,
      createdAt: this.model.createdAt,
      amount: this.model.amount,
      giftCardNumber: this.model.giftCard?.formattedGiftCardNumber,
      partnerInCharge: this.model.partner?.fullName,
    }
  }

  static serializeAll(transactions: Transaction[]) {
    return transactions.map((transaction) => new TransactionDto(transaction).serialize())
  }
}
