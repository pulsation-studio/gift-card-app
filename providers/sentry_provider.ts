import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import * as Sentry from '@sentry/node'

export default class SentryProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    if (env.get('NODE_ENV') === 'production') {
      Sentry.init({
        dsn: env.get('SENTRY_DSN'),
        tracesSampleRate: 1.0,
        environment: env.get('NODE_ENV'),
      })
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
