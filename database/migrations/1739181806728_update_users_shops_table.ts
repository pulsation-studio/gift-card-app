import { PartnerRole } from '#types/partner_roles'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shop_user'
  protected uniqueContraintName = 'unique_manager_per_shop'

  async up() {
    this.schema.raw(`
      CREATE UNIQUE INDEX ${this.uniqueContraintName} ON ${this.tableName} (shop_id)
      WHERE shop_role = '${PartnerRole.MANAGER}'
    `)
  }

  async down() {
    this.schema.raw(`DROP INDEX IF EXISTS ${this.uniqueContraintName}`)
  }
}
