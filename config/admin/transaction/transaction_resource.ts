import { Resource } from '#admin/models'
import { ResourceBuilder } from '#admin/services'
import { Transaction } from '#models/transaction'
import { TransactionService } from '#services/admin-context/transaction_service'

export function TransactionResource(): Resource<typeof Transaction> {
  return new ResourceBuilder(Transaction, {
    label: 'Transaction',
    label_plural: 'Transactions',
    path: 'transactions',
  })
    .addFields([
      { headerLabel: '#', valueKey: 'id' },
      { headerLabel: 'Fait le', valueKey: 'createdAt', dateFormat: 'dd/MM/yyyy HH:mm' },
      { headerLabel: 'Validé par', valueKey: 'partner.fullName' },
      { headerLabel: 'Numéro de la carte', valueKey: 'giftCard.formattedGiftCardNumber' },
      { headerLabel: 'Montant', valueKey: 'amount', wrapBy: 'currencyFormatter' },
      { headerLabel: 'Notes', valueKey: 'notes', longField: true },
      { headerLabel: 'Boutique', valueKey: 'shop.name' },
    ])
    .setQuerySetResolver(TransactionService.getTransactionsWithRelationShips)
    .setInstancesSerializer(TransactionService.serializeTransaction)
    .build()
}
