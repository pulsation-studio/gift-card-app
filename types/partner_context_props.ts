import { LayoutProps } from './layout_props.js'
import { NavConfig } from './nav_config.js'
import { PartnerRole } from './partner_roles.js'

interface ShopDto {
  id: number
  name: string
  street: string
  postalCode: string
  city: string
  address: string
}

export interface PartnerDto {
  firstName: string
  lastName: string
  fullName: string
  email: string
  shopRole: PartnerRole
  shop: ShopDto
}

export interface PartnerContextProps extends LayoutProps {
  navConfig: NavConfig
  partnerAccountPath: string
  partner: PartnerDto
}
