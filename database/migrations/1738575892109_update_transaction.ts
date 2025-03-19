import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('shop_id').unsigned().references('id').inTable('shops').onDelete('SET NULL')

      table.dropForeign('partner_id')
      table.integer('partner_id').unsigned().nullable().alter()
      table.foreign('partner_id').references('id').inTable('users').onDelete('SET NULL')

      table.dropForeign('gift_card_id')
      table.integer('gift_card_id').unsigned().nullable().alter()
      table.foreign('gift_card_id').references('id').inTable('gift_cards').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shop_id')

      table.dropForeign('partner_id')
      table.integer('partner_id').unsigned().notNullable().alter()
      table.foreign('partner_id').references('id').inTable('users').onDelete('CASCADE')

      table.dropForeign('gift_card_id')
      table.integer('gift_card_id').unsigned().notNullable().alter()
      table.foreign('gift_card_id').references('id').inTable('gift_cards').onDelete('CASCADE')
    })
  }
}
