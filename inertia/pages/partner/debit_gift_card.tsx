import DebitGiftCardController from '#controllers/partner/debit_gift_card_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Stack, Title, Text } from '@mantine/core'
import { BackButton } from '~/components/back_button'
import { DebitGiftCardForm } from '~/forms/debit_gift_card_form'
import { Alerts } from '~/components/alerts'
import { FatalErrorModal } from '~/components/fatal_error_modal'

export default function DebitGiftCardView(
  props: InferPageProps<DebitGiftCardController, 'showDebitGiftCardView'>
) {
  return (
    <>
      <Head title="Débiter une Carte cadeau" />
      <Stack>
        <BackButton
          label={'Carte ' + props.giftCard.formattedGiftCardNumber}
          href={props.showGiftCardPath}
        />
        <Title order={1}>Débit</Title>
        <Text>{props.settings.debitGiftCard.description}</Text>
        <Alerts alerts={props.alerts} />
        <DebitGiftCardForm {...props} />
        {/* @ts-ignore */}
        <FatalErrorModal {...props} />
      </Stack>
    </>
  )
}
