import User from '#models/user'
import { TokenType } from '#types/token_type'
import { afterFetch, afterFind, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare type: TokenType

  @column()
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare isAvailable: boolean

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>

  @afterFind()
  static async tokenIsValid(token: Token) {
    if (token.expiresAt < DateTime.now()) {
      token.isAvailable = false
      await token.save()
    }
  }

  @afterFetch()
  static tokensAreValid(tokens: Token[]) {
    tokens.forEach(async (token: Token) => await this.tokenIsValid(token))
  }

  public isValid() {
    return this.isAvailable
  }
}
