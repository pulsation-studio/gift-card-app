import { CardStatus } from '#types/gift_card_status'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_cards'
  OLD_ENUM = `('${CardStatus.Available}', '${CardStatus.Empty}', '${CardStatus.Expired}')`
  NEW_ENUM = `('${CardStatus.Available}', '${CardStatus.Empty}', '${CardStatus.Expired}', '${CardStatus.SendingFailed}')`

  async up() {
    this.schema.raw('ALTER TABLE gift_cards ALTER COLUMN status DROP DEFAULT')
    this.schema.raw(`CREATE TYPE new_card_status AS ENUM ${this.NEW_ENUM}`)
    this.schema.raw(
      `ALTER TABLE gift_cards ALTER COLUMN status TYPE new_card_status USING status::text::new_card_status`
    )
    this.schema.raw('DROP TYPE IF EXISTS card_status')
    this.schema.raw('ALTER TYPE new_card_status RENAME TO card_status')
    this.schema.raw(
      `ALTER TABLE gift_cards ALTER COLUMN status SET DEFAULT '${CardStatus.Available}'`
    )
  }

  async down() {
    this.schema.raw('ALTER TABLE gift_cards ALTER COLUMN status DROP DEFAULT')
    this.schema.raw(`CREATE TYPE new_card_status AS ENUM ${this.OLD_ENUM}`)
    this.schema.raw(
      `ALTER TABLE gift_cards ALTER COLUMN status TYPE new_card_status USING status::text::new_card_status`
    )
    this.schema.raw('DROP TYPE IF EXISTS card_status')
    this.schema.raw('ALTER TYPE new_card_status RENAME TO card_status')
    this.schema.raw(
      `ALTER TABLE gift_cards ALTER COLUMN status SET DEFAULT '${CardStatus.Available}'`
    )
  }
}
