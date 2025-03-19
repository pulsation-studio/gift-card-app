import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import SettingsService from '#services/settings_service'
import { SettingsProps } from '#types/settings_props'

export default class SettingsMiddleware {
  async handle({ inertia }: HttpContext, next: NextFn) {
    const props: SettingsProps = {
      settings: await SettingsService.getAll(),
    }
    // @ts-expect-error ts(2345)
    inertia.share(props)
    await next()
  }
}
