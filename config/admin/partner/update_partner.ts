import { FlashManager } from '#services/flash_manager'
import { HttpContext } from '@adonisjs/core/http'

import { SelectField, SingleInstanceAction, TextField } from '#admin/models'
import { FormBuilder } from '#admin/services'
import { stayOnView } from '#helpers/stay_on_view'
import User from '#models/user'
import { UpdatePartnerValidator } from '#validators/admin/update_partner'
import logger from '@adonisjs/core/services/logger'
import { PartnerRole, PartnerRoleLabel } from '#types/partner_roles'
import { ShopService } from '#services/admin-context/shop_service'
import { NotificationBuilder } from '#services/notification_builder'

export const onUpdatePartnerError = (err: any, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  if (err.constraint === 'users_email_unique')
    FlashManager.addError('email', "L'adresse email est déja utilisée")
  else if (err.constraint === 'unique_manager_per_shop')
    FlashManager.addError('shopRole', "La boutique ne peut avoir qu'un seul gérant")
  else {
    logger.error(err)

    FlashManager.addNotification(
      new NotificationBuilder('Erreur lors de la modification du partenaire').buildError()
    )
  }

  return stayOnView(ctx)
}

export const updatePartnerCallBack: SingleInstanceAction<typeof User>['handle'] = async ({
  instance,
  model,
  request,
  db,
}) => {
  const { shopRole, shopId, ...payload } = await request.validateUsing(UpdatePartnerValidator)
  await db.transaction(async (trx) => {
    const partner = await model.findOrFail(instance.$primaryKeyValue, { client: trx })
    await model.query().where('id', instance.id).update(payload)
    await partner.related('shops').sync({
      [shopId]: {
        shop_role: shopRole,
      },
    })
  })

  FlashManager.addNotification(
    new NotificationBuilder('Partenaire modifiée avec succès').buildSuccess()
  )
}

interface PartnerUpdateExtraFields {
  shopId: string
  shopRole: string
}

export const UpdatePartnerForm = new FormBuilder<typeof User, PartnerUpdateExtraFields>()
  .add(new TextField({ accessKey: 'lastName' }, { label: 'Nom' }))
  .add(new TextField({ accessKey: 'firstName' }, { label: 'Prénom' }))
  .add(new TextField({ accessKey: 'email' }, { label: 'Adresse mail' }))
  .add(new TextField({ accessKey: 'phoneNumber' }, { label: 'Numéro de téléphone' }))
  .add(
    new SelectField(
      {
        accessKey: 'shopId',
        options: ShopService.getShopsAsOptions,
        valueAccessor: async (instance: User) => {
          const shop = await instance.getDefaultShop()
          return shop ? String(shop.id) : ''
        },
      },
      { label: 'Boutique' }
    )
  )
  .add(
    new SelectField(
      {
        accessKey: 'shopRole',
        options: () => [
          { value: PartnerRole.SALARY, label: PartnerRoleLabel[PartnerRole.SALARY] },
          { value: PartnerRole.MANAGER, label: PartnerRoleLabel[PartnerRole.MANAGER] },
        ],
        valueAccessor: async (instance: User) => {
          const shop = await instance.getDefaultShop()
          return shop ? shop.$extras.pivot_shop_role : PartnerRole.SALARY
        },
      },
      { label: 'Rôle dans la boutique' }
    )
  )
  .build()
