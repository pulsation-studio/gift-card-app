import { PartnerRole } from '#types/partner_roles'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shop_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('shop_id').unsigned().references('shops.id').onDelete('CASCADE')
      table.unique(['user_id', 'shop_id'])
      table
        .enu('shop_role', [PartnerRole.SALARY, PartnerRole.MANAGER], {
          useNative: true,
          enumName: 'user_shop_role',
          existingType: false,
        })
        .notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "user_shop_role"')
  }
}
