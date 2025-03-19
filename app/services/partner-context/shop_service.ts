import { Shop } from '#models/shop'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export class ShopService {
  private static get session() {
    return HttpContext.getOrFail().session
  }

  static hasShopInSession() {
    return this.session.has('shop')
  }

  static async loadShopInSession(shop: Shop) {
    this.session.put('shop', shop)
  }

  static removeShopInSession() {
    this.session.forget('shop')
  }

  static async getShopFromSession(): Promise<Shop> {
    const shopObjet = this.session.get('shop')

    if (!shopObjet)
      throw new Exception("Aucune boutique n'est enregistrer en session", {
        code: 'E_NO_SHOP_IN_SESSION',
      })

    const shop = await Shop.findOrFail(shopObjet.id)

    return shop
  }
}
