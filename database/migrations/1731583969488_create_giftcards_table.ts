import { CardStatus } from '#types/gift_card_status'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('expiration_date', { useTz: true }).notNullable()
      table.integer('current_amount').notNullable()
      table.integer('starting_amount').notNullable()
      table.string('secret_code').notNullable()
      table.string('gift_card_number').unique()
      table.string('owner_email').notNullable()
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE').notNullable
      table
        .enu('availability_status', [CardStatus.Available, CardStatus.Empty], {
          useNative: true,
          enumName: 'card_availability_status',
          existingType: false,
        })
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "card_availability_status"')
  }
}
