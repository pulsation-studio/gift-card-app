import User from '#models/user'
import { NewPasswordService } from '#services/new_password_service'
import settingsService from '#services/settings_service'
import env from '#start/env'
import { Role } from '#types/roles'
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class ResetAdminPassword extends BaseCommand {
  static commandName = 'admin:reset_password'
  static description = 'Send a reset password link to an admin'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    let user: User | null = null
    do {
      const email = await this.prompt.ask('Enter admin email:')

      try {
        user = await User.findByOrFail('email', email)
        user.assertHasRole(Role.ADMIN)
      } catch (error) {
        this.logger.info(error.message)
        user = null
      }
    } while (!user)
    const tokenString = await NewPasswordService.generateNewPasswordToken(user)
    // There is no HttpContext (therefore no router either) in a command, so an environment variable is necessary.
    const resetPasswordLink = `${env.get('APP_URL')}/new-password/${tokenString}`
    const settings = await settingsService.getAll()
    await NewPasswordService.sendNewPasswordMail(user, {
      passWordLink: resetPasswordLink,
      subject: `Réinitialisation de votre mot de passe - ${settings.global.name}`,
      templatePath: 'emails/reset_password',
    })
    this.logger.info('Mail sent succesfully')
  }
}
