import { handleUnknownError } from '#helpers/handle_unknown_error'
import { Shop } from '#models/shop'
import { ShopService } from '#services/partner-context/shop_service'
import BaseModelDto from '#types/base_model_dto'
import { PartnerRole } from '#types/partner_roles'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class PartnerShopController {
  public async showPartnerShopView({ inertia, response }: HttpContext) {
    try {
      const shop = await ShopService.getShopFromSession()

      const shopDto = await new ShopDto(shop).serialize()

      return inertia.render('partner/shop', {
        shop: shopDto,
        transactionsPath: router.makeUrl('partner.shop.transactions'),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, 'Erreur lors du chargement de votre boutique')
      return response.redirect().toRoute('ServerError')
    }
  }
}

class ShopDto extends BaseModelDto<Shop> {
  async serialize() {
    let serializedStaff

    try {
      await this.model.load('staff')

      serializedStaff = this.model.staff.map((partner) => ({
        id: partner.id,
        fullName: partner.fullName,
        shopRole: partner.$extras.pivot_shop_role as PartnerRole,
      }))
    } catch (error) {
      logger.info(error)
    }

    const staffIsLoaded = serializedStaff !== undefined

    return {
      name: this.model.name,
      address: this.model.address,
      staff: staffIsLoaded ? serializedStaff : [],
      staffLoadingError: staffIsLoaded ? undefined : "Erreur lors du chargement de l'équipe",
    }
  }
}
