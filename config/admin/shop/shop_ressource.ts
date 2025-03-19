import { ResourceBuilder } from '#admin/services'
import { Shop } from '#models/shop'
import { ShopService } from '#services/admin-context/shop_service'

import { Resource } from '#admin/models'
import { createShopCallBack, CreateShopForm, onCreateShopError } from './create_shop.js'
import { onUpdateShopError, updateShopCallBack, UpdateShopForm } from './update_shop.js'

export function ShopResource(): Resource<typeof Shop> {
  return new ResourceBuilder(Shop, {
    label: 'Boutique',
    label_plural: 'Boutiques',
    path: 'shops',
  })
    .addCreateAction('Ajouter une Boutique', CreateShopForm, createShopCallBack, {
      onError: onCreateShopError,
    })
    .addUpdateAction('Modifier une boutique', UpdateShopForm, updateShopCallBack, {
      onError: onUpdateShopError,
    })
    .addFields([
      { headerLabel: 'Nom', valueKey: 'name' },
      { headerLabel: 'Gérant', valueKey: 'shopManager.fullName' },
      { headerLabel: 'Adresse', valueKey: 'address', longField: true },
      {
        headerLabel: 'IBAN',
        valueKey: 'iban',
        truncate: 'start',
        longField: true,
      },
    ])
    .setQuerySetResolver(ShopService.getAllShopsWithStaff)
    .setInstancesSerializer(ShopService.serializeShops)
    .build()
}
