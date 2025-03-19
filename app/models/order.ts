import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeCreate,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import * as paymentSession from '#types/payment_session'
import { CodeGeneratorService } from '#services/code_generator_service'
import { GiftCard } from '#models/gift_card'
import * as relations from '@adonisjs/lucid/types/relations'

export type Orders = Order[]

export class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderNumber: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare customerEmail: string

  @column()
  declare paymentSessionId: paymentSession.PaymentSessionID

  @column()
  declare status: paymentSession.PaymentSessionStatus

  @column()
  declare paymentEmailSent: boolean

  @column()
  declare customerPhoneNumber: string

  @hasMany(() => GiftCard)
  declare giftCards: relations.HasMany<typeof GiftCard>

  @computed()
  get isPaid() {
    return this.status === paymentSession.PaymentSessionStatus.Paid
  }

  @afterCreate()
  public static async generateOrderNumber(order: Order) {
    order.orderNumber = CodeGeneratorService.generateOrderNumber(order.id)
    await order.save()
  }

  @beforeCreate()
  public static default(order: Order) {
    order.paymentEmailSent = false
  }
}
