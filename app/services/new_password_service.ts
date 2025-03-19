import PasswordNotification from '#mails/password_notification'
import Token from '#models/token'
import User from '#models/user'
import env from '#start/env'
import { PasswordMailTemplateProps } from '#types/password_mail_template_props'
import { TokenType } from '#types/token_type'
import string from '@adonisjs/core/helpers/string'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export class NewPasswordService {
  static async getTokenInstance(token: string) {
    return await Token.query()
      .preload('user')
      .where('token', token)
      .orderBy('createdAt', 'desc')
      .first()
  }

  static async generateNewPasswordToken(user: User) {
    const tokenString = string.generateRandom(64)

    await this.disableNewPasswordTokens(user)
    const record = await user.related('tokens').create({
      type: TokenType.NEW_PASSWORD,
      expiresAt: DateTime.now().plus({ hours: 24 }),
      token: tokenString,
    })

    return record.token
  }

  static async disableNewPasswordTokens(user: User) {
    await user.related('newPasswordTokens').query().update({
      isAvailable: false,
    })
  }

  static generateNewPasswordLink(tokenString: string) {
    const baseUrl = env.get('APP_URL')
    const newPasswordPath = router.makeUrl('new-password.view', [tokenString])
    return `${baseUrl}${newPasswordPath}`
  }

  static async sendNewPasswordMail(user: User, mailTemplateProps: PasswordMailTemplateProps) {
    logger.info('Mail sending...')
    await mail.send(new PasswordNotification(user, mailTemplateProps))
    logger.info('Mail successfully send!')
  }
}
