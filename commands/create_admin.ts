import User from '#models/user'
import { Role } from '#types/roles'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CreateAdmin extends BaseCommand {
  static commandName = 'admin:create'
  static description = 'Creates a new admin with a specified email and password'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const email = await this.prompt.ask('Enter admin email:')
    const password = await this.prompt.secure('Enter admin password:')

    const user = await User.create({
      email: email,
      password: password,
      roles: [Role.ADMIN],
    })

    this.logger.info(`Admin created: ${user.email}`)
  }
}
