import { Settings } from '#types/settings'

export abstract class SettingsService {
  abstract getAll(): Promise<Settings>
}
