import { GiftCard } from '#models/gift_card'
import { FlashManager } from '#services/flash_manager'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

import { DateTimeField, NoInstanceAction, NumberField, TextField } from '#admin/models'
import { FormBuilder } from '#admin/services'
import settings from '#config/settings'
import { stayOnView } from '#helpers/stay_on_view'
import { dateToGMTplus1 } from '#helpers/to_gmt_plus_1'
import { GiftCardsService } from '#services/gift_card_service'
import { NotificationBuilder } from '#services/notification_builder'
import { createAdminGiftCardValidator } from '#validators/admin/create_gift_card'
import { Exception } from '@adonisjs/core/exceptions'
import logger from '@adonisjs/core/services/logger'

export const onCreateGiftCardError = (err: Exception, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  logger.error(err)

  FlashManager.addNotification(
    new NotificationBuilder(
      "Une erreur est survenu lors de la création ou l'envoie de la carte cadeau"
    ).buildError()
  )

  return stayOnView(ctx)
}

export const createGiftCardCallBack: NoInstanceAction<typeof GiftCard>['handle'] = async ({
  model,
  request,
}) => {
  const { expirationDate, ownerPhoneNumber, ...giftCardPayload } = await request.validateUsing(
    createAdminGiftCardValidator
  )
  const toGMTplus1 = dateToGMTplus1(expirationDate)

  let giftCard = await model.create({
    ownerPhoneNumber: ownerPhoneNumber ? ownerPhoneNumber : undefined,
    ...giftCardPayload,
  })
  giftCard.expirationDate = toGMTplus1
  await giftCard.save()

  FlashManager.addNotification(
    new NotificationBuilder('Carte cadeau créée avec succès').buildSuccess()
  )

  await GiftCardsService.sendByMail(giftCard.ownerEmail, [giftCard], null)

  FlashManager.addNotification(
    new NotificationBuilder(
      `La carte cadeau a bien été envoyée à ${giftCard.ownerEmail}`
    ).buildSuccess()
  )
}

export const CreateGiftCardForm = new FormBuilder<typeof GiftCard>()
  .add(new TextField({ accessKey: 'ownerEmail' }, { label: 'Email du détenteur' }))
  .add(
    new TextField(
      { accessKey: 'ownerPhoneNumber' },
      { label: 'Téléphone du détenteur', required: false }
    )
  )
  .add(
    new NumberField(
      { accessKey: 'startingAmount', initialValue: Number(settings.buyGiftCards.defaultCardPrice) },
      { label: 'Montant de départ', decimalScale: 2, fixedDecimalScale: true, step: 0.01 }
    )
  )
  .add(
    new DateTimeField(
      { accessKey: 'expirationDate', initialValue: DateTime.now().plus({ years: 1 }) },
      { label: "Date d'expiration" }
    )
  )
  .build()
