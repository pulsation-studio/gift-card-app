import { stayOnView } from '#helpers/stay_on_view'
import { Shop } from '#models/shop'
import { FlashManager } from '#services/flash_manager'
import { CreateShopValidator } from '#validators/admin/create_shop'
import { HttpContext } from '@adonisjs/core/http'
import { FormBuilder } from '#admin/services'
import { TextField, NoInstanceAction } from '#admin/models'
import { NotificationBuilder } from '#services/notification_builder'

export const CreateShopForm = new FormBuilder<typeof Shop>()
  .add(new TextField({ accessKey: 'name' }, { label: 'Nom' }))
  .add(new TextField({ accessKey: 'street' }, { label: 'N° et nom de rue' }))
  .add(new TextField({ accessKey: 'postalCode' }, { label: 'Code Postal' }))
  .add(new TextField({ accessKey: 'city' }, { label: 'Ville' }))
  .add(new TextField({ accessKey: 'iban' }, { label: 'IBAN' }))
  .build()

export const createShopCallBack: NoInstanceAction<typeof Shop>['handle'] = async ({
  request,
  model,
}) => {
  const { postalCode, ...payload } = await request.validateUsing(CreateShopValidator)
  await model.create({
    postalCode: String(postalCode),
    ...payload,
  })

  FlashManager.addNotification(new NotificationBuilder('Boutique créée avec succès').buildSuccess())
}

export const onCreateShopError = (err: any, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  if (err.constraint === 'shops_name_unique') {
    FlashManager.addError(
      'name',
      'Le nom de la boutique est similaire à une boutique déjà existante'
    )
  } else {
    FlashManager.addNotification(
      new NotificationBuilder('Erreur lors de la création de la boutique').buildError()
    )
  }
  return stayOnView(ctx)
}
