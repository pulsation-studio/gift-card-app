import { capitalized } from '#helpers/capitalized'
import { Shop } from '#models/shop'
import Token from '#models/token'
import { Transaction } from '#models/transaction'
import { PartnerRole } from '#types/partner_roles'
import * as role from '#types/roles'
import { TokenType } from '#types/token_type'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Exception } from '@adonisjs/core/exceptions'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeDelete, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare roles: role.Roles

  @column()
  declare phoneNumber: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get capitalizedFirstName() {
    return capitalized(this.firstName)
  }

  @computed()
  get capitalizedLastName() {
    return capitalized(this.lastName)
  }

  @computed()
  get abbreviatedLastName() {
    const lastName = this.lastName
    return lastName !== '' ? `${lastName[0].toUpperCase()}.` : ''
  }

  @computed()
  get fullName() {
    const fullName = [this.capitalizedFirstName, this.abbreviatedLastName]
      .filter((name) => name !== '')
      .join(' ')
    return fullName
  }

  @computed()
  get highestRole() {
    if (this.roles.includes(role.Role.ADMIN)) return role.Role.ADMIN
    if (this.roles.includes(role.Role.PARTNER)) return role.Role.PARTNER

    return this.roles[0]
  }

  @computed()
  get isPartner() {
    return this.hasRole(role.Role.PARTNER)
  }

  @computed()
  get isAdmin() {
    return this.hasRole(role.Role.ADMIN)
  }

  @hasMany(() => Transaction)
  declare transactionHistory: relations.HasMany<typeof Transaction>

  @hasMany(() => Token)
  declare tokens: relations.HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', TokenType.NEW_PASSWORD),
  })
  declare newPasswordTokens: relations.HasMany<typeof Token>

  // https://lucid.adonisjs.com/docs/relationships#many-to-many-pivot-columns
  // https://lucid.adonisjs.com/docs/relationships#attach
  @manyToMany(() => Shop, {
    pivotTimestamps: true,
    pivotColumns: ['shop_role'],
  })
  declare shops: relations.ManyToMany<typeof Shop>

  @beforeDelete()
  static async removeShopUsers(user: User) {
    await user.related('shops').detach()
  }

  hasRole(requiredRole: role.Role): boolean {
    return this.roles.includes(requiredRole)
  }

  assertHasRole(requiredRole: role.Role) {
    if (!this.hasRole(requiredRole)) {
      throw new Exception(`User does not have the required role "${requiredRole}".`, {
        code: 'E_INVALID_ROLE',
      })
    }
  }

  async getDefaultShopOrFail(): Promise<Shop> {
    this.assertHasRole(role.Role.PARTNER)

    if (this.shops === undefined) await this.load('shops')

    if (this.shops.length === 0)
      throw new Exception('Partner has no shop registered', { code: 'E_PARTNER_HAS_NOT_SHOP' })

    const defaultShop = this.shops[0]
    return defaultShop
  }

  async getDefaultShop(): Promise<Shop | null> {
    this.assertHasRole(role.Role.PARTNER)

    if (this.shops === undefined) await this.load('shops')

    if (this.shops.length === 0) return null

    const defaultShop = this.shops[0]
    return defaultShop
  }

  async assertPartnerWorkInShop(shopId: number) {
    this.assertHasRole(role.Role.PARTNER)

    if (this.shops === undefined) await this.load('shops')

    const isWorkInShop = this.shops.find((shop) => shop.id === shopId)

    if (!isWorkInShop)
      throw new Exception('Partner not work in shop', {
        code: 'E_PARTNER_NOT_WORK_IN_SHOP',
      })
  }

  async getPartnerRoleInShop(shop: Shop) {
    this.assertHasRole(role.Role.PARTNER)

    if (this.shops === undefined) await this.load('shops')

    const retrievedShop = this.shops.find((s) => s.id === shop.id)

    if (retrievedShop === undefined)
      throw new Exception('Partner not work in shop', {
        code: 'E_PARTNER_NOT_WORK_IN_SHOP',
      })

    const partnerRole = retrievedShop.$extras.pivot_shop_role as PartnerRole

    return partnerRole
  }
}
