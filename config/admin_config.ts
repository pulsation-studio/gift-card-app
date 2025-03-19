import { AdminConfig } from '#admin/models'
import { AdminResource } from './admin/admin/admin_ressource.js'
import { GiftCardResource } from './admin/gift_card/gift_card_resource.js'
import { PartnerResource } from './admin/partner/partner_ressource.js'
import { ShopResource } from './admin/shop/shop_ressource.js'
import { TransactionResource } from './admin/transaction/transaction_resource.js'

const adminConfig: AdminConfig = {
  resources: [
    PartnerResource(),
    GiftCardResource(),
    ShopResource(),
    TransactionResource(),
    AdminResource(),
  ],
  title: 'Pulsadmin',
  logoutPath: '/admin/logout',
  defaultPath: '/admin/partners',
}

export default adminConfig
