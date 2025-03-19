import { handleUnknownError } from '#helpers/handle_unknown_error'
import { FlashManager } from '#services/flash_manager'
import { NewPasswordService } from '#services/new_password_service'
import { ResetPasswordValidator } from '#validators/reset_password'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class NewPasswordController {
  public async view({ inertia, params, response }: HttpContext) {
    try {
      const tokenString = params.token
      const tokenInstance = await NewPasswordService.getTokenInstance(tokenString)
      const tokenIsNotValid = !tokenInstance || !tokenInstance.isValid()

      if (tokenIsNotValid) throw Error('Invalid Token')

      return inertia.render('new_password', {
        newPasswordSubmitPath: router.makeUrl('new-password.submit'),
        token: tokenInstance.token,
      })
    } catch (error) {
      logger.error(error)
      return response.abort('', 404)
    }
  }

  public async submit({ request, response }: HttpContext) {
    const { password, token } = await request.validateUsing(ResetPasswordValidator)

    try {
      const tokenInstance = await NewPasswordService.getTokenInstance(token)
      const tokenIsNotValid = !tokenInstance || !tokenInstance.isValid()

      if (tokenIsNotValid) {
        FlashManager.setFatalError("Session expirée ou le compte associé n'a pu être trouvé")
        return response.redirect().back()
      }

      const user = tokenInstance.user

      await user.merge({ password }).save()
      await tokenInstance.merge({ isAvailable: false }).save()
      const loginPath = router.makeUrl(`${user.highestRole}.login.view`)
      return response.redirect().toRoute(loginPath)
    } catch (error) {
      logger.error(error)
      handleUnknownError(error, 'La requête a échoué')
      return response.redirect().back()
    }
  }
}
