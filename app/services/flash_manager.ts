import { Alert } from '#types/alert'
import FatalError from '#types/fatal_error'
import { Notification } from '#types/notification'
import { HttpContext } from '@adonisjs/core/http'
import { ValuesStore } from '@adonisjs/session'
import { AllowedSessionValues } from '@adonisjs/session/types'

export class FlashManager {
  private static get session() {
    return HttpContext.getOrFail().session
  }

  static addAlert(alert: Alert): void {
    const store = this.session.responseFlashMessages
    this.mergeArrayInStore(store, 'alerts', [alert])
  }

  static addNotification(notification: Notification): void {
    const store = this.session.responseFlashMessages
    this.mergeArrayInStore(store, 'notifications', [notification])
  }

  static addError(fieldKey: string, message: string): void {
    this.session.responseFlashMessages.merge({ errors: { [fieldKey]: message } })
  }

  static setFatalError(message: string): void {
    this.set('fatalError', new FatalError(message))
  }

  static set(key: string, value: AllowedSessionValues): void {
    this.session.flash(key, value)
  }

  public static useWithoutRedirection(): void {
    const session = this.session
    this.mergeStoreInto(session.flashMessages, session.responseFlashMessages)
    session.responseFlashMessages.clear()
  }

  private static mergeArrayInStore<T extends AllowedSessionValues>(
    store: ValuesStore,
    key: string,
    items: T[]
  ): void {
    const existingValue: unknown = store.get(key)

    if (Array.isArray(existingValue)) {
      store.update({ [key]: [...existingValue, ...items] })
    } else if (existingValue !== undefined) {
      store.update({ [key]: items })
    } else {
      store.set(key, items)
    }
  }

  private static mergeStoreInto(targetStore: ValuesStore, sourceStore: ValuesStore): void {
    for (const [key, value] of Object.entries(sourceStore.all())) {
      if (Array.isArray(value)) {
        this.mergeArrayInStore(targetStore, key, value)
      } else {
        targetStore.update({ [key]: value })
      }
    }
  }
}
