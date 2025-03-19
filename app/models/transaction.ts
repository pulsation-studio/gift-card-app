import { GiftCard } from '#models/gift_card'
import { Shop } from '#models/shop'
import User from '#models/user'
import { CodeGeneratorService } from '#services/code_generator_service'
import { afterCreate, BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export type Transactions = Transaction[]

export class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionNumber: string

  @column()
  declare partnerId: number
  @belongsTo(() => User, {
    foreignKey: 'partnerId',
  })
  declare partner: relations.BelongsTo<typeof User>

  @column()
  declare giftCardId: number
  @belongsTo(() => GiftCard)
  declare giftCard: relations.BelongsTo<typeof GiftCard>

  @column()
  declare shopId: number
  @belongsTo(() => Shop)
  declare shop: relations.BelongsTo<typeof Shop>

  @column()
  declare amount: number

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async checkPartnerWorkInShop(transaction: Transaction) {
    const user = await User.findOrFail(transaction.partnerId)

    await user.assertPartnerWorkInShop(transaction.shopId)
  }

  @afterCreate()
  public static async generateTransactionNumber(transaction: Transaction) {
    transaction.transactionNumber = CodeGeneratorService.generateTransactionNumber(transaction.id)
    await transaction.save()
  }
}
