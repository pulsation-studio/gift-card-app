import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateGiftCardAmounts extends BaseSchema {
  protected tableName = 'gift_cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('current_amount', 12, 2).notNullable().alter()
      table.decimal('starting_amount', 12, 2).notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('current_amount').notNullable().alter()
      table.integer('starting_amount').notNullable().alter()
    })
  }
}
