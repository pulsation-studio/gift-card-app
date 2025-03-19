import { handleUnknownError } from '#helpers/handle_unknown_error'
import { GiftCard } from '#models/gift_card'
import { AlertBuilder } from '#services/alert_builder'
import { FlashManager } from '#services/flash_manager'
import { GiftCardService } from '#services/partner-context/gift_card_service'
import BaseModelDto from '#types/base_model_dto'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class ShowGiftCardController {
  public async showGiftCardView({ inertia, response, params }: HttpContext) {
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

      if (giftCard.isExpired) {
        const alert = new AlertBuilder(
          'Carte invalide : La date d’expiration est dans le passé'
        ).buildError()
        FlashManager.addAlert(alert)
      }

      FlashManager.useWithoutRedirection()
      return inertia.render('partner/show_gift_card', {
        partnerHomePath: router.makeUrl('partner.home'),
        debitGiftCardPath: router.makeUrl('partner.giftCard.debit.view', {
          giftCardNumber: giftCard.giftCardNumber,
        }),
        giftCard: new GiftCardDto(giftCard).serialize(),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, "Erreur lors de l'affichage de la carte cadeau")
      return response.redirect().toRoute('ServerError')
    }
  }
}

class GiftCardDto extends BaseModelDto<GiftCard> {
  serialize() {
    return {
      formattedGiftCardNumber: this.model.formattedGiftCardNumber,
      currentAmount: this.model.currentAmount,
      expirationDate: this.model.expirationDate.toFormat('dd/MM/yyyy'),
      isAvailable: this.model.isAvailable,
    }
  }
}
