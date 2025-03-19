import adminConfig from '#config/admin_config'
import AuthException from '#exceptions/auth_exception'
import { handleUnknownError } from '#helpers/handle_unknown_error'
import { AlertBuilder } from '#services/alert_builder'
import AuthService from '#services/auth_service'
import { FlashManager } from '#services/flash_manager'
import { Role } from '#types/roles'
import { loginValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class AdminAuthController {
  roleRequired = Role.ADMIN

  public async showAdminLoginView({ inertia, response }: HttpContext) {
    try {
      return inertia.render('admin/login', {
        loginPath: router.makeUrl('admin.login.submit'),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement de la page de connexion')
      return response.redirect().toRoute('ServerError')
    }
  }

  public async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    try {
      await AuthService.login(payload.email, payload.password, this.roleRequired)

      return response.redirect().toPath(adminConfig.defaultPath)
    } catch (error) {
      logger.error(error)

      if (error instanceof AuthException) {
        const alert = new AlertBuilder(
          'Veuillez entrer un email et un mot de passe valides'
        ).buildError()

        FlashManager.addAlert(alert)
      } else {
        handleUnknownError(error)
      }

      return response.redirect().toRoute('admin.login.view')
    }
  }

  public async logout({ response }: HttpContext) {
    try {
      await AuthService.logout()
      return response.redirect().toRoute('admin.login.view')
    } catch (error) {
      logger.error(error)
      handleUnknownError(error, "Nous n'avons pas réussi à vous déconnecter")
      return response.redirect().toPath(adminConfig.defaultPath)
    }
  }
}
