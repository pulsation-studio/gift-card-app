import PurchaseGiftCardsController from '#controllers/guest/purchase_gift_cards_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Accordion, Flex, List, NavLink, Stack, Text, Title } from '@mantine/core'
import { FaChevronLeft } from '@react-icons/all-files/fa/FaChevronLeft'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { PurchaseGiftCardsForm } from '~/forms/purchase_gift_cards_form'

export default function PurchaseGiftCardsView(
  props: InferPageProps<PurchaseGiftCardsController, 'showGiftCardsPurchaseView'>
) {
  return (
    <>
      <Head title="Offrir une carte" />
      <Stack gap="md" px="lg" py="md">
        <NavLink
          href={props.settings.global.mainSiteLink}
          label={<Text fw={700}>Accueil</Text>}
          leftSection={<FaChevronLeft />}
          style={{ width: 'fit-content' }}
        />

        <Title order={1}>{props.settings.buyGiftCards.title}</Title>

        <Text>{props.settings.buyGiftCards.description}</Text>

        <Accordion bg="#fff">
          <Accordion.Item value="item1">
            <Accordion.Control>
              <Title order={3}>Informations complémentaires</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <List>
                {props.settings.buyGiftCards.additionalInformations?.map((message, index) => (
                  <List.Item key={index}>{message}</List.Item>
                ))}
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Flex justify="space-between" direction={{ base: 'column', sm: 'row-reverse' }} gap="sm">
          <Stack
            w={{ base: '100%', sm: '50%' }}
            h={{ base: '100%', sm: 'auto' }}
            align="center"
            gap="sm"
          >
            <img
              src="/demo_card.webp"
              alt="Carte cadeau de démonstration"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '650px',
                minWidth: '350px',
                maxWidth: '1200px',
              }}
            />
            <Text>(Photo non contractuelle)</Text>
          </Stack>
          <PurchaseGiftCardsForm {...props} />
        </Flex>
      </Stack>
      {/* @ts-ignore */}
      <FatalErrorModal {...props} />
    </>
  )
}
