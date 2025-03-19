import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('owner_phone_number')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('owner_phone_number')
    })
  }
}
