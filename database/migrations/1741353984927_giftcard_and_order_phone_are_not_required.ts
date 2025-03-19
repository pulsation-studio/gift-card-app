import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('orders', (table) => {
      table.string('customer_phone_number').nullable().alter()
    })
    this.schema.alterTable('gift_cards', (table) => {
      table.string('owner_phone_number').nullable().alter()
    })
  }

  async down() {}
}
