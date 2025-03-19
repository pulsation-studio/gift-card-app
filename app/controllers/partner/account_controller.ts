import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import logger from '@adonisjs/core/services/logger'
import { FlashManager } from '#services/flash_manager'
import { AlertBuilder } from '#services/alert_builder'
import { NewPasswordService } from '#services/new_password_service'
import { handleUnknownError } from '#helpers/handle_unknown_error'
import settingsService from '#services/settings_service'

export default class PartnerAccountController {
  public async showPartnerAccountView({ inertia, response }: HttpContext) {
    try {
      return inertia.render('partner/account', {
        logoutPath: router.makeUrl('partner.logout'),
        resetPasswordPath: router.makeUrl('partner.account.resetPassword'),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement de votre compte')
      return response.redirect().toRoute('ServerError')
    }
  }

  public async resetPassword({ response, auth }: HttpContext) {
    let alert

    try {
      const user = await auth.authenticate()
      alert = new AlertBuilder(
        'Vous allez recevoir un lien de réinitialisation de mot de passe sous peu.'
      ).buildSuccess()

      const tokenString = await NewPasswordService.generateNewPasswordToken(user)
      const newPasswordLink = await NewPasswordService.generateNewPasswordLink(tokenString)
      const settings = await settingsService.getAll()
      await NewPasswordService.sendNewPasswordMail(user, {
        passWordLink: newPasswordLink,
        subject: `Nouveau mot de passe - ${settings.global.name}`,
        templatePath: 'emails/new_password',
      })
      logger.info('new password email sent')
    } catch (error) {
      logger.error(error)
      alert = new AlertBuilder(
        "Erreur durant l'envoi du mail de réinitialisation de mot de passe."
      ).buildError()
    }

    FlashManager.addAlert(alert)
    return response.redirect().back()
  }
}
