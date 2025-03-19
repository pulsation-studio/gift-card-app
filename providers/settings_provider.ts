import type { ApplicationService } from '@adonisjs/core/types'
import { SettingsService } from '#types/settings_service'

export default class SettingsProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { ConfigSettingService } = await import('#services/config_setting_service')

    this.app.container.singleton(SettingsService, () => {
      return this.app.container.make(ConfigSettingService)
    })
  }
}
