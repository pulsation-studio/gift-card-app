import PartnerShopTransactionsController from '#controllers/partner/shop_transaction_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Stack, ScrollArea, Title } from '@mantine/core'
import { BackButton } from '~/components/back_button'
import { TransactionBox } from '~/components/transaction_box'

export default function PartnerShopTransactionList(
  props: InferPageProps<PartnerShopTransactionsController, 'showShopTransactionsList'>
) {
  return (
    <>
      <Head title="Transactions" />
      <Stack>
        <BackButton label="Ma boutique" href={props.shopPath} />
        <Title order={1}>Transactions</Title>
        {/* <SearchInput></SearchInput> */}
        <ScrollArea>
          {props.transactions.map((transaction) => (
            <TransactionBox transaction={transaction} />
          ))}
        </ScrollArea>
      </Stack>
    </>
  )
}
