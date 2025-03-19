import { GiftCard } from '#models/gift_card'
import { FlashManager } from '#services/flash_manager'
import { UpdateGiftCardValidator } from '#validators/admin/update_gift_card'
import { HttpContext } from '@adonisjs/core/http'

import { DateTimeField, SingleInstanceAction, TextField } from '#admin/models'
import { FormBuilder } from '#admin/services'
import { stayOnView } from '#helpers/stay_on_view'
import { dateToGMTplus1 } from '#helpers/to_gmt_plus_1'
import { NotificationBuilder } from '#services/notification_builder'

export const onUpdateGiftCardError = (err: any, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  FlashManager.addNotification(
    new NotificationBuilder('Erreur lors de la modification de la carte cadeau').buildError()
  )

  return stayOnView(ctx)
}

export const updateGiftCardCallBack: SingleInstanceAction<typeof GiftCard>['handle'] = async ({
  instance,
  model,
  request,
}) => {
  const { expirationDate, ...payload } = await request.validateUsing(UpdateGiftCardValidator)
  const toGMTplus1 = dateToGMTplus1(expirationDate)
  await model
    .query()
    .where('id', instance.id)
    .update({ expirationDate: toGMTplus1, ...payload })

  FlashManager.addNotification(
    new NotificationBuilder('Carte cadeau modifiée avec succès').buildSuccess()
  )
}

export const UpdateGiftCardForm = new FormBuilder<typeof GiftCard>()
  .add(new TextField({ accessKey: 'ownerEmail' }, { label: 'Adresse email du détenteur' }))
  .add(
    new TextField(
      { accessKey: 'ownerPhoneNumber' },
      { label: 'Téléphone du détenteur', required: false }
    )
  )
  .add(
    new TextField(
      { accessKey: 'formattedGiftCardNumber' },
      { label: 'Identifiant Carte', disabled: true }
    )
  )
  .add(new DateTimeField({ accessKey: 'expirationDate' }, { label: "Date d'expiration" }))
  .build()
