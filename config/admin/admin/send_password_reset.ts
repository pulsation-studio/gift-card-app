import { HttpMethod, SingleInstanceAction } from '#admin/models'
import { ActionBuilder } from '#admin/services'
import User from '#models/user'
import { FlashManager } from '#services/flash_manager'
import { NewPasswordService } from '#services/new_password_service'
import { NotificationBuilder } from '#services/notification_builder'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

const sendPasswordResetCallBack: SingleInstanceAction<typeof User>['handle'] = async ({
  instance,
}) => {
  const tokenStr = await NewPasswordService.generateNewPasswordToken(instance)
  const resetPasswordLink = NewPasswordService.generateNewPasswordLink(tokenStr)
  await NewPasswordService.sendNewPasswordMail(instance, {
    passWordLink: resetPasswordLink,
    subject: 'Réinitialisation de votre mot de passe - Pulsadmin',
    templatePath: 'emails/reset_password',
  })

  FlashManager.addNotification(
    new NotificationBuilder(
      `Le mail de réinitialisation de mot de passe à bien été envoyé à ${instance.email}`
    ).buildSuccess()
  )
}

const onSendPasswordResetError = (err: any, ctx: HttpContext) => {
  logger.error(err)

  FlashManager.addNotification(
    new NotificationBuilder(
      "Erreur lors de l'envoie du mail de réinitialisation de mot de passe"
    ).buildError()
  )

  return ctx.response.redirect('/admin/admins')
}

export function SendPasswordResetAction(): SingleInstanceAction<typeof User> {
  return new ActionBuilder<typeof User, typeof SingleInstanceAction<typeof User>>(
    'send-password-reset',
    'Envoyer un mail de réinitialisation du mot de passe',
    SingleInstanceAction<typeof User>,
    HttpMethod.POST,
    sendPasswordResetCallBack,
    { iconLibrary: 'md', iconName: 'MdEmail' }
  )
    .addErrorHandler(onSendPasswordResetError)
    .buildHeadless({ message: 'Voulez-vous envoyer ce mail de réinitialisation du mot de passe ?' })
}
