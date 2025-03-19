import { Title, Text, Anchor, Stack, Button } from '@mantine/core'
import { Head, Link } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'

import PurchaseGiftCardsController from '#controllers/guest/purchase_gift_cards_controller'
import { BackButton } from '~/components/back_button'

export default function DisplayPaymentSuccess(
  props: InferPageProps<PurchaseGiftCardsController, 'showPaymentSuccessView'>
) {
  return (
    <>
      <Head title={props.settings.displayPaymentSuccess.tabTitle} />
      <Stack gap="md" px="lg" py="md">
        <BackButton
          label={`Retourner sur ${props.settings.global.name}`}
          href={props.settings.global.mainSiteLink}
        />

        <Title order={1}>{props.settings.displayPaymentSuccess.title}</Title>

        <Text m="sm">
          No Commande : <b>{props.order.orderNumber}</b>
        </Text>

        <Text>{props.settings.displayPaymentSuccess.description}</Text>

        <Text>
          Vous n’avez pas reçu votre carte-cadeau ?
          <Anchor
            href={props.settings.global.contactLink}
            target="_blank"
            underline="always"
            ml="sm"
          >
            Contactez-nous
          </Anchor>
        </Text>

        <Button
          href={props.buyMoreGiftCardsPath}
          variant="subtle"
          component={Link}
          w={{ sm: 'fit-content' }}
        >
          Acheter une autre carte
        </Button>
      </Stack>
    </>
  )
}
