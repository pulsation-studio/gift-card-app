import { PaymentSessionStatus } from '#types/payment_session'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .enu(
          'status',
          [PaymentSessionStatus.Pending, PaymentSessionStatus.Paid, PaymentSessionStatus.Canceled],
          {
            useNative: true,
            enumName: 'order_status',
            existingType: false,
          }
        )
        .notNullable()
      table.string('customer_email', 254).notNullable()
      table.string('payment_session_id').notNullable().unique()
      table.string('order_number').unique()
      table.boolean('payment_email_sent').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "order_status"')
  }
}
