import { Title, Stack, Button } from '@mantine/core'
import { Head, Link } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'
import { RiShoppingBagFill } from '@react-icons/all-files/ri/RiShoppingBagFill'

import ShowGiftCardController from '#controllers/partner/show_gift_card_controller'

import { BackButton } from '~/components/back_button'
import { Alerts } from '~/components/alerts'
import { GiftCard } from '~/components/gift_card'

export default function ShowGiftCard(
  props: InferPageProps<ShowGiftCardController, 'showGiftCardView'>
) {
  return (
    <>
      <Head title="Carte cadeau" />
      <Stack align="stretch">
        <BackButton label="Accueil" href={props.partnerHomePath} />

        <Title order={1}>Carte Cadeau</Title>

        <Alerts alerts={props.alerts} />

        <GiftCard
          formattedGiftCardNumber={props.giftCard.formattedGiftCardNumber}
          currentAmount={props.giftCard.currentAmount}
          expirationDate={props.giftCard.expirationDate}
        />

        <Button
          component={Link}
          href={props.debitGiftCardPath}
          w={{ base: '100%', sm: 150 }}
          leftSection={<RiShoppingBagFill />}
          disabled={!props.giftCard.isAvailable}
          onClick={(event) => {
            if (!props.giftCard.isAvailable) event.preventDefault()
          }}
        >
          Débiter
        </Button>
      </Stack>
    </>
  )
}
