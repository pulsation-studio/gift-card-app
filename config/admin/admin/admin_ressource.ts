import User from '#models/user'

import { Resource } from '#admin/models'
import { ResourceBuilder } from '#admin/services'
import { UsersService } from '#services/admin-context/user_service'
import { SendPasswordResetAction } from './send_password_reset.js'

export function AdminResource(): Resource<typeof User> {
  return new ResourceBuilder(User, {
    label: 'Administrateur',
    label_plural: 'Administrateurs',
    path: 'admins',
  })

    .addFields([
      { headerLabel: 'Nom', valueKey: 'capitalizedLastName' },
      { headerLabel: 'Prénom', valueKey: 'capitalizedFirstName' },
      { headerLabel: 'Email', valueKey: 'email' },
      {
        valueKey: 'createdAt',
        headerLabel: 'Créé le',
        dateFormat: 'dd/MM/yyyy',
      },
    ])
    .setQuerySetResolver(UsersService.getAdmins)
    .addAction(SendPasswordResetAction())
    .build()
}
