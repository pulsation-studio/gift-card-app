import { test } from '@japa/runner'
import SettingsService from '#services/settings_service'
import GiftCardsPurchaseNotification from '#mails/gift_cards_purchase_notification'

test.group('Buy Gift Card Confirmation', () => {
  test('prepare email for sending', async () => {
    const email = new GiftCardsPurchaseNotification('test@test.com', [], null)
    const settings = await SettingsService.getAll()

    await email.buildWithContents()

    email.message.assertSubject(settings.buyGiftCards.confirmationMail.subject)
    email.message.assertTo('test@test.com')
    email.message.assertFrom(
      settings.global.emailDefaultFromAddress,
      settings.global.emailDefaultFromName
    )
  })
})
