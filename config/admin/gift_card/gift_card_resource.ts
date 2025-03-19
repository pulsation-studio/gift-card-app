import { ResourceBuilder } from '#admin/services'
import { GiftCard } from '#models/gift_card'

import { Resource } from '#admin/models'
import { CardStatusLabel } from '#types/gift_card_status'
import {
  createGiftCardCallBack,
  CreateGiftCardForm,
  onCreateGiftCardError,
} from './create_gift_card.js'
import {
  onUpdateGiftCardError,
  updateGiftCardCallBack,
  UpdateGiftCardForm,
} from './update_gift_card.js'
import { SendGiftCardViaEmailAction } from './send_via_mail.js'

export function GiftCardResource(): Resource<typeof GiftCard> {
  return new ResourceBuilder(GiftCard, {
    label: 'Carte Cadeau',
    label_plural: 'Cartes Cadeaux',
    path: 'gift-cards',
  })
    .addFields([
      { headerLabel: 'Adresse email', valueKey: 'ownerEmail', longField: true },
      { headerLabel: 'Téléphone', valueKey: 'ownerPhoneNumber' },
      { headerLabel: 'Créée le', valueKey: 'createdAt', dateFormat: 'dd/MM/yyyy' },
      { headerLabel: 'Identifiant carte', valueKey: 'formattedGiftCardNumber' },
      { headerLabel: 'Statut', valueKey: 'status', enumLabels: CardStatusLabel },
      {
        headerLabel: 'Montant de départ',
        valueKey: 'startingAmount',
        wrapBy: 'currencyFormatter',
      },
      {
        headerLabel: 'Montant actuel',
        valueKey: 'currentAmount',
        wrapBy: 'currencyFormatter',
      },
      { headerLabel: "Date d'expiration", valueKey: 'expirationDate', dateFormat: 'dd/MM/yyyy' },
    ])
    .addUpdateAction('Modifier une Carte Cadeau', UpdateGiftCardForm, updateGiftCardCallBack, {
      onError: onUpdateGiftCardError,
    })
    .addCreateAction('Ajouter une Carte Cadeau', CreateGiftCardForm, createGiftCardCallBack, {
      onError: onCreateGiftCardError,
    })
    .addAction(SendGiftCardViaEmailAction())
    .addDeleteAction({ message: 'Voulez-vous confirmer la suppression de cette carte-cadeau ?' })
    .build()
}
