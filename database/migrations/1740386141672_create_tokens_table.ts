import { TokenType } from '#types/token_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .enu('type', [TokenType.NEW_PASSWORD], {
          useNative: true,
          enumName: 'token_type_enum',
          existingType: false,
        })
        .notNullable()
      table.boolean('is_available').notNullable().defaultTo(true)
      table.string('token', 64).notNullable()

      table.timestamp('expires_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "token_type_enum"')
  }
}
