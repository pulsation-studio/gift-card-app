import AuthService from '#services/auth_service'
import { Role } from '#types/roles'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  private loginRoleRedirections: Record<Role, string> = {
    [Role.ADMIN]: router.makeUrl('admin.login.view'),
    [Role.PARTNER]: router.makeUrl('partner.login.view'),
  }

  async handle({ response }: HttpContext, next: NextFn, options: { roleRequired: Role }) {
    try {
      await AuthService.authenticate(options.roleRequired)

      return next()
    } catch (error) {
      const redirectionPath = this.loginRoleRedirections[options.roleRequired]
      response.redirect(redirectionPath)
    }
  }
}
