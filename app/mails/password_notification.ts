import User from '#models/user'
import SettingsService from '#services/settings_service'
import { PasswordMailTemplateProps } from '#types/password_mail_template_props'
import { BaseMail } from '@adonisjs/mail'

export default class PasswordNotification extends BaseMail {
  private user: User
  private mailTemplateProps: PasswordMailTemplateProps

  constructor(user: User, mailTemplateProps: PasswordMailTemplateProps) {
    super()
    this.user = user
    this.mailTemplateProps = mailTemplateProps
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    const settings = await SettingsService.getAll()
    this.message
      .htmlView(this.mailTemplateProps.templatePath, {
        newPasswordLink: this.mailTemplateProps.passWordLink,
        user: this.user,
      })
      .to(this.user.email)
      .subject(this.mailTemplateProps.subject)
      .from(
        settings.global.passwordRelatedMailsFromAddress,
        settings.global.passwordRelatedMailsFromName
      )
  }
}
