import { MailField, ModelDto, NoInstanceAction, SelectField, TextField } from '#admin/models'
import { FormBuilder } from '#admin/services'
import { stayOnView } from '#helpers/stay_on_view'
import User from '#models/user'
import { ShopService } from '#services/admin-context/shop_service'
import { FlashManager } from '#services/flash_manager'
import { NewPasswordService } from '#services/new_password_service'
import { NotificationBuilder } from '#services/notification_builder'
import settingsService from '#services/settings_service'
import { PartnerRole, PartnerRoleLabel } from '#types/partner_roles'
import { Role } from '#types/roles'
import { CreatePartnerValidator } from '#validators/admin/create_partner'
import string from '@adonisjs/core/helpers/string'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

interface PartnerExtraFields {
  shopId: string
  shopRole: string
}

export const CreatePartnerForm = new FormBuilder<typeof User, PartnerExtraFields>()
  .add(new TextField({ accessKey: 'firstName' }, { label: 'Prénom' }))
  .add(new TextField({ accessKey: 'lastName' }, { label: 'Nom' }))
  .add(new MailField({ accessKey: 'email' }, { label: 'Adresse mail' }))
  .add(new TextField({ accessKey: 'phoneNumber' }, { label: 'Numéro de téléphone' }))
  .add(
    new SelectField(
      { accessKey: 'shopId', options: ShopService.getShopsAsOptions },
      { label: 'Boutique' }
    )
  )
  .add(
    new SelectField(
      {
        accessKey: 'shopRole',
        initialValue: PartnerRole.SALARY,
        options: () => [
          { value: PartnerRole.SALARY, label: PartnerRoleLabel[PartnerRole.SALARY] },
          { value: PartnerRole.MANAGER, label: PartnerRoleLabel[PartnerRole.MANAGER] },
        ],
      },
      { label: 'Rôle dans la boutique' }
    )
  )
  .build()

export const createPartnerCallBack: NoInstanceAction<typeof User>['handle'] = async ({
  request,
  model,
  db,
}) => {
  const defaultValues: Partial<ModelDto<typeof User>> = { roles: [Role.PARTNER] }
  const { shopRole, shopId, ...partnerPayload } =
    await request.validateUsing(CreatePartnerValidator)

  const password = string.generateRandom(32)
  const partner = await db.transaction(async (trx) => {
    const newPartner = await model.create(
      { password: password, ...defaultValues, ...partnerPayload },
      { client: trx }
    )

    await newPartner.related('shops').attach({
      [shopId]: {
        shop_role: shopRole,
      },
    })

    return newPartner
  })
  try {
    const tokenString = await NewPasswordService.generateNewPasswordToken(partner)
    const newPasswordLink = NewPasswordService.generateNewPasswordLink(tokenString)
    const settings = await settingsService.getAll()
    await NewPasswordService.sendNewPasswordMail(partner, {
      passWordLink: newPasswordLink,
      subject: `Bienvenue sur l'application de cartes cadeaux ${settings.global.name} !`,
      templatePath: 'emails/new_partner',
    })

    FlashManager.addNotification(
      new NotificationBuilder('Partenaire créé avec succès!').buildSuccess()
    )
  } catch (error) {
    await partner.delete()
    throw error
  }
}

export const onCreatePartnerError = (err: any, ctx: HttpContext) => {
  if (err.code === 'E_VALIDATION_ERROR') throw err

  if (err.constraint === 'users_email_unique')
    FlashManager.addError('email', "L'adresse email est déja utilisée")
  else if (err.constraint === 'unique_manager_per_shop')
    FlashManager.addError('shopRole', "La boutique ne peut avoir qu'un seul gérant")
  else if (err.code === 'EENVELOPE')
    FlashManager.addError('email', "L'adresse email renseignée n'existe pas")
  else {
    logger.error(err)

    FlashManager.addNotification(
      new NotificationBuilder('Erreur lors de la création du partenaire').buildError()
    )
  }

  return stayOnView(ctx)
}
