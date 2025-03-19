import AuthException from '#exceptions/auth_exception'
import { handleUnknownError } from '#helpers/handle_unknown_error'
import { AlertBuilder } from '#services/alert_builder'
import AuthService from '#services/auth_service'
import { FlashManager } from '#services/flash_manager'
import { ShopService } from '#services/partner-context/shop_service'
import { Role } from '#types/roles'
import { loginValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class PartnerAuthController {
  roleRequired = Role.PARTNER

  public async showPartnerLoginView({ inertia, response }: HttpContext) {
    try {
      return inertia.render('partner/login', {
        loginPath: router.makeUrl('partner.login.submit'),
        forgotPasswordPath: router.makeUrl('partner.forgot-password.view'),
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
      const partner = await AuthService.login(payload.email, payload.password, this.roleRequired)

      if (!ShopService.hasShopInSession()) {
        const defaultShop = await partner.getDefaultShopOrFail()
        await ShopService.loadShopInSession(defaultShop)
      }

      return response.redirect().toRoute('partner.home')
    } catch (error) {
      logger.error(error)

      if (error.code === 'E_PARTNER_HAS_NOT_SHOP') {
        FlashManager.setFatalError("Le partenaire n'est affilié a aucune boutique")
      } else if (error instanceof AuthException) {
        const alert = new AlertBuilder(
          'Veuillez entrer un email et un mot de passe valides'
        ).buildError()

        FlashManager.addAlert(alert)
      } else {
        handleUnknownError(error)
      }

      return response.redirect().toRoute('partner.login.view')
    }
  }

  public async logout({ response }: HttpContext) {
    try {
      await AuthService.logout()

      ShopService.removeShopInSession()

      return response.redirect().toRoute('partner.login.view')
    } catch (error) {
      logger.error(error)

      FlashManager.setFatalError("Nous n'avons pas réussi à vous déconnecter")
      return response.redirect().toRoute('partner.account')
    }
  }
}
