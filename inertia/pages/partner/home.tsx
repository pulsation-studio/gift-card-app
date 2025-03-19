import PartnerHomeController from '#controllers/partner/home_controller'
import { PartnerContextProps } from '#types/partner_context_props'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Stack, Title } from '@mantine/core'
import { Alerts } from '~/components/alerts'
import { SearchGiftCardComponent } from '~/components/search_gift_card'

export default function Home(
  props: InferPageProps<PartnerHomeController, 'showPartnerHomeView'> & PartnerContextProps
) {
  return (
    <>
      <Head title="Accueil" />
      <Stack>
        <Title order={1}>Bienvenue {props.partner.fullName}</Title>
        <Alerts alerts={props.alerts} />

        {/* @ts-ignore */}
        <SearchGiftCardComponent searchPath={props.searchPath} settings={props.settings} />
      </Stack>
    </>
  )
}
