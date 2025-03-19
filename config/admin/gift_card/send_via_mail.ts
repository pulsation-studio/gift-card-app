import { HttpMethod, SingleInstanceAction } from '#admin/models'
import { ActionBuilder } from '#admin/services'

import { GiftCard } from '#models/gift_card'
import { FlashManager } from '#services/flash_manager'
import { GiftCardsService } from '#services/gift_card_service'
import { NotificationBuilder } from '#services/notification_builder'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

const sendViaMailCallBack: SingleInstanceAction<typeof GiftCard>['handle'] = async ({
  instance,
}) => {
  await GiftCardsService.sendByMail(instance.ownerEmail, [instance], null)

  FlashManager.addNotification(
    new NotificationBuilder(
      `La carte cadeau a bien été envoyée à ${instance.ownerEmail}`
    ).buildSuccess()
  )
}

const onSendViaMailError = (err: any, ctx: HttpContext) => {
  logger.error(err)

  FlashManager.addNotification(
    new NotificationBuilder("Erreur lors de l'envoi de la carte cadeau par email").buildError()
  )

  return ctx.response.redirect('/admin/gift-cards')
}

export function SendGiftCardViaEmailAction(): SingleInstanceAction<typeof GiftCard> {
  return new ActionBuilder<typeof GiftCard, typeof SingleInstanceAction<typeof GiftCard>>(
    'send-via-mail',
    'Envoyer par mail',
    SingleInstanceAction<typeof GiftCard>,
    HttpMethod.POST,
    sendViaMailCallBack,
    { iconLibrary: 'md', iconName: 'MdEmail' }
  )
    .addErrorHandler(onSendViaMailError)
    .buildHeadless({ message: 'Voulez-vous renvoyer cette carte-cadeau par email ?' })
}
