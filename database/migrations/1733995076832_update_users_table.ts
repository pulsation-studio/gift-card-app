import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddFirstAndLastNameToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('first_name').notNullable().defaultTo('')
      table.string('last_name').notNullable().defaultTo('')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('first_name')
      table.dropColumn('last_name')
    })
  }
}
