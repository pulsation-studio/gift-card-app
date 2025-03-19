import AuthException from '#exceptions/auth_exception'
import User from '#models/user'
import { Role } from '#types/roles'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthService {
  private static get auth() {
    return HttpContext.getOrFail().auth
  }

  static async login(email: string, password: string, roleRequired: Role) {
    try {
      const user = await User.verifyCredentials(email, password)

      user.assertHasRole(roleRequired)

      await this.auth.use('web').login(user)

      return user
    } catch (error) {
      if (['E_INVALID_CREDENTIALS', 'E_INVALID_ROLE'].includes(error.code)) {
        throw new AuthException(error.message, { code: error.code })
      }
      throw error
    }
  }

  static async logout() {
    await this.auth.use('web').logout()
  }

  static async authenticate(roleRequired: Role) {
    const user = await this.auth.authenticate()
    user.assertHasRole(roleRequired)
    return user
  }
}
