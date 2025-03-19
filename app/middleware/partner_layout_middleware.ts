import User from '#models/user'
import { ShopService } from '#services/partner-context/shop_service'
import BaseModelDtoSerializer from '#types/base_model_dto'
import { LayoutChoice } from '#types/layout_choice'
import { NavConfig } from '#types/nav_config'
import { PartnerContextProps, PartnerDto } from '#types/partner_context_props'
import { Role } from '#types/roles'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { NextFn } from '@adonisjs/core/types/http'

export default class PartnerLayout {
  public async handle({ inertia, auth }: HttpContext, next: NextFn) {
    const navConfig: NavConfig = [
      { label: 'Accueil', path: router.makeUrl('partner.home') },
      { label: 'Boutique', path: router.makeUrl('partner.shop.details') },
    ]

    const userId = auth.getUserOrFail().$primaryKeyValue
    const user = await User.findOrFail(userId)

    const props: PartnerContextProps = {
      layout: LayoutChoice.PARTNER,
      navConfig: navConfig,
      partnerAccountPath: router.makeUrl('partner.account.view'),
      partner: await new PartnerDtoSerializer(user).serialize(),
    }

    // @ts-expect-error ts(2345)
    inertia.share(props)

    await next()
  }
}

class PartnerDtoSerializer extends BaseModelDtoSerializer<User> {
  constructor(protected model: User) {
    super(model)
    this.model.assertHasRole(Role.PARTNER)
  }

  async serialize(): Promise<PartnerDto> {
    const shop = await ShopService.getShopFromSession()

    const shopRole = await this.model.getPartnerRoleInShop(shop)

    return {
      firstName: this.model.firstName,
      lastName: this.model.lastName,
      fullName: this.model.fullName,
      email: this.model.email,
      shop: {
        id: shop.id,
        name: shop.name,
        address: shop.address,
        city: shop.city,
        postalCode: shop.postalCode,
        street: shop.street,
      },
      shopRole: shopRole,
    }
  }
}
