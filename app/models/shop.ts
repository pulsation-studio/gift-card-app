import { Transaction } from '#models/transaction'
import { BaseModel, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export type Shops = Shop[]

export class Shop extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare street: string

  @column()
  declare postalCode: string

  @column()
  declare city: string

  @computed()
  get address() {
    return `${this.street}, ${this.postalCode}, ${this.city}`
  }

  @column()
  declare iban: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Transaction)
  declare transactionHistory: relations.HasMany<typeof Transaction>

  @manyToMany(() => User, {
    pivotTimestamps: true,
    pivotColumns: ['shop_role'],
  })
  declare staff: relations.ManyToMany<typeof User>
}
