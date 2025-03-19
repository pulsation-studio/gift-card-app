import User from '#models/user'
import { PartnerRole } from '#types/partner_roles'
import { Role } from '#types/roles'
import { ModelObject } from '@adonisjs/lucid/types/model'
import BaseModelDto from '#types/base_model_dto'

export class UsersService {
  static readonly selectUserByRoleQuery = 'roles @> ARRAY[?]::user_role[]'

  static async getAdmins() {
    const admins = await User.query().whereRaw(UsersService.selectUserByRoleQuery, [Role.ADMIN])

    return admins
  }

  static async getPartners() {
    const partners = await User.query()
      .whereRaw(UsersService.selectUserByRoleQuery, [Role.PARTNER])
      .preload('shops', (query) => query.pivotColumns(['shop_role']))

    return partners
  }

  static async serializePartners(partners: InstanceType<typeof User>[]): Promise<ModelObject[]> {
    return Promise.all(partners.map((partner) => new PartnerDto(partner).serialize()))
  }
}

class PartnerDto extends BaseModelDto<User> {
  async serialize() {
    const defaultShop = await this.model.getDefaultShop()

    const defaultShopRole = defaultShop
      ? (defaultShop.$extras.pivot_shop_role as PartnerRole)
      : null

    return {
      primaryKeyValue: this.model.$primaryKeyValue,
      capitalizedLastName: this.model.capitalizedLastName,
      capitalizedFirstName: this.model.capitalizedFirstName,
      email: this.model.email,
      phoneNumber: this.model.phoneNumber,
      createdAt: this.model.createdAt,
      defaultShop: { name: defaultShop?.name ?? 'PAS DE BOUTIQUE' },
      defaultShopRole: defaultShopRole,
    }
  }
}
