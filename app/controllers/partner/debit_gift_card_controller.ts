import { handleUnknownError } from '#helpers/handle_unknown_error'
import { GiftCard } from '#models/gift_card'
import { AlertBuilder } from '#services/alert_builder'
import { FlashManager } from '#services/flash_manager'
import { GiftCardService } from '#services/partner-context/gift_card_service'
import { TransactionService } from '#services/partner-context/transaction_service'
import BaseModelDto from '#types/base_model_dto'
import { debitGiftCardValidator } from '#validators/debit_gift_card'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class DebitGiftCardController {
  public async showDebitGiftCardView({ inertia, response, params }: HttpContext) {
    try {
      const giftCardNumber = params.giftCardNumber
      const giftCard = await GiftCardService.findByGiftCardNumber(giftCardNumber)

      if (giftCard === null) {
        const alert = new AlertBuilder(
          'Carte invalide : Identifiant de carte inexistant'
        ).buildError()
        FlashManager.addAlert(alert)
        return response.redirect().toRoute('partner.home')
      }

      if (!giftCard.isAvailable) {
        const alert = new AlertBuilder(
          'Erreur lors du chargement de la page de débit : Carte invalide'
        ).buildError()
        FlashManager.addAlert(alert)
        return response.redirect().toRoute('partner.giftCard.show', {
          giftCardNumber: giftCard.giftCardNumber,
        })
      }

      return inertia.render('partner/debit_gift_card', {
        giftCard: new GiftCardDto(giftCard).serialize(),
        debitPath: router.makeUrl('partner.giftCard.debit.submit', {
          giftCardNumber: giftCard.giftCardNumber,
        }),
        showGiftCardPath: router.makeUrl('partner.giftCard.show', {
          giftCardNumber: giftCard.giftCardNumber,
        }),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement de la page de connexion')
      return response.redirect().toRoute('ServerError')
    }
  }

  public async debitGiftCard({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(debitGiftCardValidator)

    const giftCardNumber = params.giftCardNumber
    const secretCode = payload.secretCode

    try {
      const giftCard = await GiftCardService.findByGiftCardNumberOrFail(giftCardNumber)

      giftCard.assertSecretCodeIsValid(secretCode)

      const transaction = await TransactionService.debitGiftCard(
        giftCard,
        payload.amount,
        payload.notes
      )

      const alert = new AlertBuilder(
        `Transaction ${transaction.transactionNumber} effectuée avec succès.`
      ).buildSuccess()

      FlashManager.addAlert(alert)

      return response
        .redirect()
        .toRoute('partner.giftCard.show', { giftCardNumber: giftCardNumber })
    } catch (error) {
      logger.error(error)

      this.debitErrorHandler(error)
      return response
        .redirect()
        .toRoute('partner.giftCard.debit.view', { giftCardNumber: giftCardNumber })
    }
  }

  private debitErrorHandler(e: Exception) {
    const errorHandler = {
      E_ROW_NOT_FOUND: () =>
        FlashManager.setFatalError('Carte invalide : Identifiant de carte inexistant'),
      E_INVALID_NUMBER: () =>
        FlashManager.setFatalError('Carte invalide : Identifiant de carte inexistant'),
      E_INVALID_SECRET_CODE: () => FlashManager.addError('secretCode', 'Code de carte erroné'),
      E_INSUFFICIENT_AMOUNT: () =>
        FlashManager.addError('amount', 'Montant supérieur à la valeur de la carte'),
      E_NEGATIVE_AMOUNT: () =>
        FlashManager.addError('amount', 'Le montant doit être supérieur à 0'),
      DEFAULT: () =>
        handleUnknownError(
          e,
          'Une erreur est survenue pendant la transaction. Veuillez réessayer. Si le problème persiste, veuillez contacter l’organisme'
        ),
    }

    const isHandledError = e.code !== undefined && Object.keys(errorHandler).includes(e.code)

    if (isHandledError) errorHandler[e.code as keyof typeof errorHandler]()
    else errorHandler['DEFAULT']()
  }
}

class GiftCardDto extends BaseModelDto<GiftCard> {
  serialize() {
    return {
      formattedGiftCardNumber: this.model.formattedGiftCardNumber,
      currentAmount: this.model.currentAmount,
    }
  }
}
