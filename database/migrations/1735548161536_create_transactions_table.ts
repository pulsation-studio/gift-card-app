import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTransactionsTable extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_number').unique()
      table
        .integer('partner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('gift_card_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('gift_cards')
        .onDelete('CASCADE')
      table.decimal('amount', 12, 2).notNullable()
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
