import { FlashManager } from '#services/flash_manager'
import { Exception } from '@adonisjs/core/exceptions'
import * as Sentry from '@sentry/node'

export function handleUnknownError(error: Exception, message?: string): void {
  Sentry.captureException(error)
  FlashManager.setFatalError(message ?? 'Une erreur inconnue est survenue')
}
