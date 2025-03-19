import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import FatalError from '#types/fatal_error'
import { Notifications } from '#types/notification'
import { Alerts } from '#types/alert'
import { MiddlewareProps } from '#types/middleware_props'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    alerts: (ctx) => ctx.session?.flashMessages.get('alerts'),
    notifications: (ctx) => ctx.session?.flashMessages.get('notifications'),
    fatalError: (ctx) => ctx.session?.flashMessages.get('fatalError'),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig>, MiddlewareProps {
    errors?: Record<string, string[]>
    fatalError?: FatalError
    notifications?: Notifications
    alerts?: Alerts
  }
}
