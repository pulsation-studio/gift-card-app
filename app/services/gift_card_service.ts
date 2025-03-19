import SendingGiftCardErrorNotification from '#mails/sending_giftcard_error_notification'
import GiftCardsPurchaseNotification from '#mails/gift_cards_purchase_notification'
import { GiftCard, GiftCards } from '#models/gift_card'
import BaseModelDto from '#types/base_model_dto'
import { FileGeneratorService } from '#types/file_generator_service'
import { Exception } from '@adonisjs/core/exceptions'
import { Invoice } from '#types/payment_session'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'

export class GiftCardsService {
  private static async generateGiftCardsPdfs(giftCards: GiftCards) {
    const fileGeneratorService = await app.container.make(FileGeneratorService)

    const filesGenerationParams = giftCards.map((giftCard) => ({
      data: new GiftCardDto(giftCard).serialize(),
      templatePath: app.makePath('public/templates/gift_card_purchase_template.odt'),
      fileName: `Carte-cadeau ${giftCard.giftCardNumber}.pdf`,
      expectedFormat: 'pdf',
    }))

    const giftCardPdfs = await fileGeneratorService.generateFiles(filesGenerationParams)

    return giftCardPdfs
  }

  static async sendByMail(email: string, giftCards: GiftCards, invoice: Invoice | null) {
    const pdfs = await this.generateGiftCardsPdfs(giftCards)

    try {
      logger.info('Sending mail...')
      await mail.send(new GiftCardsPurchaseNotification(email, pdfs, invoice))
      logger.info('Mail successfully send!')
    } catch (error) {
      logger.error(error, 'Error during gift card mail sending')

      giftCards.forEach(async (giftCard) => await giftCard.giftCardSendingHasFailed())

      await this.reportGiftCardSendigErrorToAdmin(giftCards)
      throw new Exception('Error during gift card mail sending', {
        code: 'E_GIFTCARD_MAIL_SENDING',
      })
    }
  }

  static async reportGiftCardSendigErrorToAdmin(giftCards: GiftCards) {
    try {
      await mail.send(new SendingGiftCardErrorNotification(giftCards))
    } catch (error) {
      logger.error(error, 'Error sending failure notification email')
    }
  }
}

class GiftCardDto extends BaseModelDto<GiftCard> {
  serialize() {
    return {
      startingAmount: this.model.startingAmount,
      secretCode: this.model.secretCode,
      formattedGiftCardNumber: this.model.formattedGiftCardNumber,
      expirationDate: this.model.expirationDate.toISO(),
    }
  }
}
