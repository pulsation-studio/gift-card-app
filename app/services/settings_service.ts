import { SettingsService } from '#types/settings_service'
import app from '@adonisjs/core/services/app'

let settingsService: SettingsService

await app.booted(async () => {
  settingsService = await app.container.make(SettingsService)
})
export { settingsService as default }
