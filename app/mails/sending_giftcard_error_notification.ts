import { GiftCards } from '#models/gift_card'
import SettingsService from '#services/settings_service'
import { BaseMail } from '@adonisjs/mail'
export default class SendingGiftCardErrorNotification extends BaseMail {
  private giftCards: GiftCards

  constructor(giftCards: GiftCards) {
    super()
    this.giftCards = giftCards
  }

  async prepare() {
    const settings = await SettingsService.getAll()
    this.message
      .htmlView('emails/gift_card_mail_error', {
        giftCards: this.giftCards,
      })
      .to(settings.global.emailDefaultFromAddress)
      .subject("Erreur de l'envoi d'un mail de cartes cadeaux")
      .from(settings.global.emailDefaultFromAddress, settings.global.emailDefaultFromName)
  }
}
