import { Settings } from '#types/settings'
import { SettingsService } from '#types/settings_service'
import config from '@adonisjs/core/services/config'

export class ConfigSettingService implements SettingsService {
  getAll(): Promise<Settings> {
    const settings = config.get<Settings>('settings')
    return new Promise((resolve) => {
      resolve(settings)
    })
  }
}
