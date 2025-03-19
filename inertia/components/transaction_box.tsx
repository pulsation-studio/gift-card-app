import PartnerShopTransactionsController from '#controllers/partner/shop_transaction_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Badge, Group, Stack, Text } from '@mantine/core'
import { DateTime } from 'luxon'

export function TransactionBox({
  transaction,
}: {
  transaction: InferPageProps<
    PartnerShopTransactionsController,
    'showShopTransactionsList'
  >['transactions'][number]
}) {
  const formattedTransactionDate = DateTime.fromISO(transaction.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  )
  return (
    <Group justify="space-between" my="sm" bg="white" p="sm" style={{ borderRadius: '10px' }}>
      <Stack gap={0} justify="space-between">
        <Text size="xs" fw={700}>
          #{transaction.id}
        </Text>
        <Text>{transaction.giftCardNumber ?? 'carte supprimée'}</Text>
        <Text size="xs">Validé(e) par {transaction.partnerInCharge ?? 'partenaire supprimé'}</Text>
      </Stack>
      <Stack>
        <Badge size="sm" color="primary.3">
          {transaction.amount} €
        </Badge>
        <Text size="xs">{formattedTransactionDate}</Text>
      </Stack>
    </Group>
  )
}
