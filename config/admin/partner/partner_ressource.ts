import User from '#models/user'

import { Resource } from '#admin/models'
import { ResourceBuilder } from '#admin/services'
import { UsersService } from '#services/admin-context/user_service'
import { PartnerRoleLabel } from '#types/partner_roles'
import { createPartnerCallBack, CreatePartnerForm, onCreatePartnerError } from './create_partner.js'
import { onUpdatePartnerError, updatePartnerCallBack, UpdatePartnerForm } from './update_partner.js'

export function PartnerResource(): Resource<typeof User> {
  return new ResourceBuilder(User, {
    label: 'Partenaire',
    label_plural: 'Partenaires',
    path: 'partners',
  })
    .addCreateAction('Ajouter un Partenaire', CreatePartnerForm, createPartnerCallBack, {
      onError: onCreatePartnerError,
    })
    .addUpdateAction('Modifier un partenaire', UpdatePartnerForm, updatePartnerCallBack, {
      onError: onUpdatePartnerError,
    })
    .addFields([
      { headerLabel: 'Nom', valueKey: 'capitalizedLastName' },
      { headerLabel: 'Prénom', valueKey: 'capitalizedFirstName' },
      { headerLabel: 'Email', valueKey: 'email' },
      { headerLabel: 'Téléphone', valueKey: 'phoneNumber' },
      {
        valueKey: 'createdAt',
        headerLabel: 'Créé le',
        dateFormat: 'dd/MM/yyyy',
      },
      {
        valueKey: 'defaultShopRole',
        headerLabel: 'Rôle',
        enumLabels: PartnerRoleLabel,
      },
      {
        valueKey: 'defaultShop.name',
        headerLabel: 'Boutique',
      },
    ])
    .setQuerySetResolver(UsersService.getPartners)
    .setInstancesSerializer(UsersService.serializePartners)
    .build()
}
