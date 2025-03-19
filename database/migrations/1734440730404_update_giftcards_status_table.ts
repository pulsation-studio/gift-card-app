import { CardStatus } from '#types/gift_card_status'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateGiftCardsStatus extends BaseSchema {
  protected tableName = 'gift_cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('availability_status')
    })

    this.schema.raw(`
      DROP TYPE IF EXISTS card_availability_status
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('status', [CardStatus.Available, CardStatus.Empty, CardStatus.Expired], {
          useNative: true,
          enumName: 'card_status',
          existingType: false,
        })
        .notNullable()
        .defaultTo(CardStatus.Available)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })

    this.schema.raw(`
      DROP TYPE IF EXISTS card_status
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('availability_status', [CardStatus.Available, CardStatus.Empty], {
          useNative: true,
          enumName: 'card_availability_status',
          existingType: false,
        })
        .notNullable()
        .defaultTo(CardStatus.Available)
    })
  }
}
