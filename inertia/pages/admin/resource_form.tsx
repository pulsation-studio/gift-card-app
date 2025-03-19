import { AdminProps, RegularActionProps } from '#admin/models'
import { SharedProps } from '@adonisjs/inertia/types'
import { Stack, Title } from '@mantine/core'
import { AdminActionForm } from '~/components/admin/action_form'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { Notifications } from '~/components/notifications'

export default function RessourceForm(props: AdminProps & RegularActionProps & SharedProps) {
  return (
    <>
      <Stack>
        <Title order={1}>{props.title}</Title>
        <AdminActionForm {...props} />
      </Stack>

      <FatalErrorModal {...props} />
      <Notifications duration={props.settings.global.notificationsDuration} {...props} />
    </>
  )
}
