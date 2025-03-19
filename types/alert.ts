export enum AlertType {
  ERROR = 'Error',
  SUCCESS = 'Success',
  INFORMATION = 'Information',
}

export enum AlertIcon {
  INFO = 'info',
  CHECK = 'check',
  NONE = 'none',
}

export interface Alert {
  title?: string
  message: string
  type: AlertType
  icon: AlertIcon
  hasCloseButton: boolean
}

export type Alerts = Alert[]
