import { Notification, NotificationIcon, NotificationType } from '#types/notification'

export class NotificationBuilder {
  private title!: string
  private type: NotificationType = NotificationType.INFORMATION
  private hasCloseButton: boolean = false

  private message: string
  private icon: NotificationIcon = NotificationIcon.NONE

  constructor(message: string) {
    this.message = message
  }

  withCloseButton(): this {
    this.hasCloseButton = true
    return this
  }

  private setTitle(title: string): this {
    this.title = title
    return this
  }

  private setIcon(iconType: NotificationIcon) {
    this.icon = iconType
    return this
  }

  private setType(type: NotificationType): this {
    this.type = type
    return this
  }

  buildError(title?: string): Notification {
    return this.setType(NotificationType.ERROR)
      .setIcon(NotificationIcon.CROSS)
      .setTitle(title ?? 'Erreur')
      .build()
  }

  buildSuccess(title?: string): Notification {
    return this.setType(NotificationType.SUCCESS)
      .setIcon(NotificationIcon.CHECK)
      .setTitle(title ?? 'All good!')
      .build()
  }

  buildInformation(title: string): Notification {
    return this.setType(NotificationType.INFORMATION)
      .setIcon(NotificationIcon.NONE)
      .setTitle(title)
      .build()
  }

  private build(): Notification {
    return {
      title: this.title,
      message: this.message,
      type: this.type,
      icon: this.icon,
      hasCloseButton: this.hasCloseButton,
    }
  }
}
