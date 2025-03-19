import { SelectOptions } from '#admin/models'
import { Shop } from '#models/shop'
import User from '#models/user'
import BaseModelDto from '#types/base_model_dto'
import { PartnerRole } from '#types/partner_roles'

export class ShopService {
  static async getShopsAsOptions(): Promise<SelectOptions> {
    const shops = await Shop.all()
    return shops.map((shop: Shop) => ({
      value: String(shop.$primaryKeyValue),
      label: shop.name,
    }))
  }

  static async getAllShopsWithStaff() {
    return await Shop.query().preload('staff')
  }

  static async serializeShops(shops: InstanceType<typeof Shop>[]) {
    return shops.map((shop) => new ShopDto(shop).serialize())
  }
}

class ShopDto extends BaseModelDto<Shop> {
  serialize() {
    const shopManager = this.model.staff?.find(
      (partner: User) => partner.$extras.pivot_shop_role === PartnerRole.MANAGER
    )

    return {
      primaryKeyValue: this.model.$primaryKeyValue,
      name: this.model.name,
      address: this.model.address,
      iban: this.model.iban,
      shopManager: { fullName: shopManager?.fullName },
    }
  }
}
