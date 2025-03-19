import { Order } from '#models/order'
import { CodeGeneratorService } from '#services/code_generator_service'
import SettingsService from '#services/settings_service'
import encryption from '@adonisjs/core/services/encryption'
import {
  afterCreate,
  afterFetch,
  afterFind,
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { Transaction } from '#models/transaction'
import GiftCardValidityException from '#exceptions/gift_card_validity_exception'
import { CardStatus } from '#types/gift_card_status'

export type GiftCards = GiftCard[]

export class GiftCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expirationDate: DateTime

  @column()
  declare ownerEmail: string

  @column()
  declare status: CardStatus

  @column()
  declare currentAmount: number

  @column()
  declare giftCardNumber: string

  @column()
  declare startingAmount: number

  @column()
  declare ownerPhoneNumber: string

  @hasMany(() => Transaction)
  declare transactionHistory: relations.HasMany<typeof Transaction>

  @column({
    prepare: (value: string) => encryption.encrypt(value),
    consume: (value: string) => encryption.decrypt(value),
    serialize: () => undefined,
  })
  declare secretCode: string

  @column()
  declare orderId: number

  @computed()
  get formattedGiftCardNumber() {
    return this.giftCardNumber.replace(/(.{3})/g, '$1-')
  }

  @computed()
  get isEmpty() {
    return this.status === CardStatus.Empty
  }

  @computed()
  get isAvailable() {
    return this.status === CardStatus.Available
  }

  @computed()
  get isExpired() {
    return this.status === CardStatus.Expired
  }

  @belongsTo(() => Order, { serializeAs: null })
  declare order: relations.BelongsTo<typeof Order>

  @beforeCreate()
  public static setCurrentAmount(giftCard: GiftCard) {
    giftCard.currentAmount = giftCard.startingAmount
  }

  @beforeCreate()
  public static async defineExpirationDate(giftCard: GiftCard) {
    const settings = await SettingsService.getAll()
    giftCard.expirationDate = DateTime.now().plus({
      months: settings.giftCard.expirationDateInMonths,
    })
  }

  @beforeCreate()
  public static generateGiftCardSecretCode(giftCard: GiftCard) {
    giftCard.secretCode = CodeGeneratorService.generateFourDigitCode().toString()
  }

  @beforeCreate()
  public static defaultCardStatus(giftCard: GiftCard) {
    giftCard.status = CardStatus.Available
  }

  @afterCreate()
  public static async generateGiftCardNumber(giftCard: GiftCard) {
    giftCard.giftCardNumber = CodeGeneratorService.generateCardNumber(giftCard.id)
    await giftCard.save()
  }

  @afterFetch()
  public static async resolveCardsStatus(giftCards: GiftCards) {
    giftCards.forEach(async (giftCard) => await this.resolveCardStatus(giftCard))
  }

  @afterFind()
  public static async resolveCardStatus(giftCard: GiftCard) {
    if (giftCard.isAvailable && giftCard.currentAmount <= 0) {
      giftCard.status = CardStatus.Empty
      await giftCard.save()
    }

    if (giftCard.isAvailable && giftCard.expirationDate <= DateTime.now()) {
      giftCard.status = CardStatus.Expired
      await giftCard.save()
    }
  }

  public assertSecretCodeIsValid(secretCode: string): void {
    if (this.secretCode !== secretCode) {
      throw new GiftCardValidityException('Invalid secret code.', { code: 'E_INVALID_SECRET_CODE' })
    }
  }

  public assertHasSufficientFunds(amount: number): void {
    if (this.currentAmount < amount) {
      throw new GiftCardValidityException('Insufficient funds', { code: 'E_INSUFFICIENT_AMOUNT' })
    }
  }

  public assertAmountIsPositive(amount: number): void {
    if (amount <= 0) {
      throw new GiftCardValidityException('The amount must be greater than zero', {
        code: 'E_NEGATIVE_AMOUNT',
      })
    }
  }

  static assertGiftCardNumberIsValid(giftCardNumber: unknown): asserts giftCardNumber is string {
    if (typeof giftCardNumber !== 'string') {
      throw new GiftCardValidityException('Invalid gift card number format :' + giftCardNumber, {
        code: 'E_INVALID_NUMBER',
      })
    }
  }

  public async giftCardSendingHasFailed() {
    this.status = CardStatus.SendingFailed
    await this.save()
  }

  public async debit(amount: number) {
    this.assertHasSufficientFunds(amount)
    this.currentAmount -= amount
    await this.save()
  }
}
