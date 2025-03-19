import { Exception } from '@adonisjs/core/exceptions'

export default class GiftCardValidityException extends Exception {
  declare code:
    | 'E_INVALID_SECRET_CODE'
    | 'E_INSUFFICIENT_AMOUNT'
    | 'E_NEGATIVE_AMOUNT'
    | 'E_INVALID_NUMBER'
}
