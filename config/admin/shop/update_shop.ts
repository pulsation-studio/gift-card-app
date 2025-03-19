import { FlashManager } from '#services/flash_manager'
import { HttpContext } from '@adonisjs/core/http'

import { SingleInstanceAction, TextField } from '#admin/models'
import { FormBuilder } from '#admin/services'
import { stayOnView } from '#helpers/stay_on_view'
import { Shop } from '#models/shop'
import { UpdateShopValidator } from '#validators/admin/update_shop'
import { NotificationBuilder } from '#services/notification_builder'

export const onUpdateShopError = (err: any, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  if (err.constraint === 'shops_name_unique') {
    FlashManager.addError(
      'name',
      'Le nom de la boutique est similaire à une boutique déjà existante'
    )
  } else {
    FlashManager.addNotification(
      new NotificationBuilder('Erreur lors de la modification de la boutique').buildError()
    )
  }
  return stayOnView(ctx)
}

export const updateShopCallBack: SingleInstanceAction<typeof Shop>['handle'] = async ({
  instance,
  model,
  request,
}) => {
  const payload = await request.validateUsing(UpdateShopValidator)
  await model.query().where('id', instance.id).update(payload)

  FlashManager.addNotification(
    new NotificationBuilder('Boutique modifiée avec succès').buildSuccess()
  )
}

export const UpdateShopForm = new FormBuilder<typeof Shop>()
  .add(new TextField({ accessKey: 'name' }, { label: 'Nom' }))
  .add(new TextField({ accessKey: 'street' }, { label: 'N° et nom de rue' }))
  .add(new TextField({ accessKey: 'postalCode' }, { label: 'Code postal' }))
  .add(new TextField({ accessKey: 'city' }, { label: 'Ville' }))
  .add(new TextField({ accessKey: 'iban' }, { label: 'IBAN' }))
  .build()
