import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shops'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').unique().alter()
      table.string('street')
      table.string('postal_code')
      table.string('city')
      table.string('iban')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['name'])
      table.dropColumn('street')
      table.dropColumn('postal_code')
      table.dropColumn('city')
      table.dropColumn('iban')
    })
  }
}
