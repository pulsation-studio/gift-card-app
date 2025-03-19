import { handleUnknownError } from '#helpers/handle_unknown_error'
import User from '#models/user'
import { AlertBuilder } from '#services/alert_builder'
import { FlashManager } from '#services/flash_manager'
import { NewPasswordService } from '#services/new_password_service'
import settingsService from '#services/settings_service'
import { SettingsService } from '#types/settings_service'
import { ForgotPasswordValidator } from '#validators/forgot_password'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class ForgotPasswordController {
  public async view({ inertia, response }: HttpContext) {
    try {
      return inertia.render('partner/forgot_password', {
        forgotPasswordSubmitPath: router.makeUrl('partner.forgot-password.submit'),
        loginPath: router.makeUrl('partner.login.view'),
      })
    } catch (error) {
      logger.error(error)
      handleUnknownError(error, 'Erreur durant le chargement de la page de réinitialisation')
      return response.redirect().toRoute('ServerError')
    }
  }

  public async submit({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(ForgotPasswordValidator)

    const alert = new AlertBuilder(
      'Vous allez recevoir un lien de réinitialisation de mot de passe sous peu.'
    ).buildSuccess()

    FlashManager.addAlert(alert)

    try {
      const user = await User.findByOrFail('email', email)
      const tokenString = await NewPasswordService.generateNewPasswordToken(user)
      const resetPasswordLink = NewPasswordService.generateNewPasswordLink(tokenString)
      const settings = await settingsService.getAll()
      await NewPasswordService.sendNewPasswordMail(user, {
        passWordLink: resetPasswordLink,
        subject: `Réinitialisation de votre mot de passe - ${settings.global.name}`,
        templatePath: 'emails/reset_password',
      })
      logger.info('new password email sent')
    } catch (error) {
      logger.error(error)
    }

    return response.redirect().back()
  }
}
