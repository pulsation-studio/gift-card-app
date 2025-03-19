import SettingsService from '#services/settings_service'
import { Files } from '#types/file_generator_service'
import { Invoice } from '#types/payment_session'
import logger from '@adonisjs/core/services/logger'
import { BaseMail } from '@adonisjs/mail'

export default class GiftCardsPurchaseNotification extends BaseMail {
  private replyToEmail: string
  private giftCardPdfs: Files
  private invoice: Invoice | null

  constructor(replyTo: string, giftCardPdfs: Files, paymentSession: Invoice | null) {
    super()
    this.replyToEmail = replyTo
    this.giftCardPdfs = giftCardPdfs
    this.invoice = paymentSession
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    logger.info(`Preparing gift card purchase confirmation email...`)

    const settings = await SettingsService.getAll()
    this.message
      .htmlView('emails/gift_card_purchase_confirmation', {
        settings: settings,
        invoice: this.invoice,
      })
      .to(this.replyToEmail)
      .subject(settings.buyGiftCards.confirmationMail.subject)
      .from(settings.global.emailDefaultFromAddress, settings.global.emailDefaultFromName)

    for (const pdf of this.giftCardPdfs) {
      const arrayBuffer = await pdf.arrayBuffer()
      this.message.attachData(Buffer.from(arrayBuffer), {
        filename: pdf.name,
      })
    }

    logger.info('Email successfully prepared!')
  }
}
