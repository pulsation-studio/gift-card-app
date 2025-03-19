import { Exception } from '@adonisjs/core/exceptions'

export default class AuthException extends Exception {
  status = 401
  declare code: 'E_INVALID_CREDENTIALS' | 'E_INVALID_ROLE'
}
