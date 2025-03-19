import PartnerAccountController from '#controllers/partner/account_controller'
import { PartnerContextProps } from '#types/partner_context_props'
import { PartnerRoleLabel } from '#types/partner_roles'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, router } from '@inertiajs/react'
import { Avatar, Badge, Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { FiLogOut } from '@react-icons/all-files/fi/FiLogOut'
import { MdSecurity } from '@react-icons/all-files/md/MdSecurity'
import { Alerts } from '~/components/alerts'

export default function Account(
  props: InferPageProps<PartnerAccountController, 'showPartnerAccountView'> & PartnerContextProps
) {
  const [isResetPasswordSubmitting, setResetPasswordSubmitting] = useState(false)

  useEffect(() => setResetPasswordSubmitting(false), [props])

  const submitResetPasswordEvent = () => {
    setResetPasswordSubmitting(true)
    router.post(props.resetPasswordPath)
  }

  return (
    <>
      <Head title="Mon Compte" />
      <Stack>
        <Title order={1}>Mon compte</Title>

        <Alerts alerts={props.alerts} isReloading={isResetPasswordSubmitting} />

        <Group justify="start" gap="md">
          <Avatar variant="filled" radius="xl" size="lg" />
          <Stack justify="start" gap="xs">
            <Badge size="md">{PartnerRoleLabel[props.partner.shopRole]}</Badge>
            <Text fw={700} size="md">
              {props.partner.firstName + ' ' + props.partner.lastName}
            </Text>
            <Text size="md">{props.partner.email}</Text>
          </Stack>
        </Group>

        <Stack style={{ width: 'fit-content' }} gap="xs">
          <Button
            size="md"
            justify="start"
            variant="default"
            leftSection={isResetPasswordSubmitting ? <Loader size="xs" /> : <MdSecurity />}
            disabled={isResetPasswordSubmitting}
            onClick={submitResetPasswordEvent}
          >
            Modifier mon mot de passe
          </Button>

          <Button
            size="md"
            justify="start"
            variant="default"
            leftSection={<FiLogOut size={20} />}
            onClick={() => router.post(props.logoutPath)}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Stack>
    </>
  )
}
