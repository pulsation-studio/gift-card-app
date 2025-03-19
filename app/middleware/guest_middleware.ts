import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import router from '@adonisjs/core/services/router'
import { Role } from '#types/roles'
import adminConfig from '#config/admin_config'

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
export default class GuestMiddleware {
  /**
   * The URL to redirect to when user is logged-in
   */
  private homeRoleRedirections: Record<Role, string> = {
    [Role.ADMIN]: adminConfig.defaultPath,
    [Role.PARTNER]: router.makeUrl('partner.home'),
  }

  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      const user = await auth.authenticate()
      const userRole = user.highestRole

      const redirectPath = this.homeRoleRedirections[userRole]
      return response.redirect(redirectPath)
    } catch (error) {
      return next()
    }
  }
}
