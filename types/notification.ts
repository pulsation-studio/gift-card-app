export enum NotificationType {
  ERROR = 'Error',
  SUCCESS = 'Success',
  INFORMATION = 'Information',
}

export enum NotificationIcon {
  CROSS = 'cross',
  CHECK = 'check',
  NONE = 'none',
}

export interface Notification {
  title: string
  message: string
  type: NotificationType
  icon: NotificationIcon
  hasCloseButton: boolean
}

export type Notifications = Notification[]
