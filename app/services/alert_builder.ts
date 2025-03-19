import { Alert, AlertIcon, AlertType } from '#types/alert'

export class AlertBuilder {
  private title?: string
  private type: AlertType = AlertType.INFORMATION
  private hasCloseButton: boolean = false

  private message: string
  private icon: AlertIcon = AlertIcon.INFO

  constructor(message: string) {
    this.message = message
  }

  withCloseButton(): this {
    this.hasCloseButton = true
    return this
  }

  setTitle(title: string): this {
    this.title = title
    return this
  }

  private setIcon(iconType: AlertIcon) {
    this.icon = iconType
    return this
  }

  private setType(type: AlertType): this {
    this.type = type
    return this
  }

  buildError(): Alert {
    return this.setType(AlertType.ERROR).setIcon(AlertIcon.INFO).build()
  }

  buildSuccess(): Alert {
    return this.setType(AlertType.SUCCESS).setIcon(AlertIcon.CHECK).build()
  }

  private build(): Alert {
    return {
      title: this.title,
      message: this.message,
      type: this.type,
      icon: this.icon,
      hasCloseButton: this.hasCloseButton,
    }
  }
}
