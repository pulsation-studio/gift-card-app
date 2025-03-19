import { ActionButton, AdminProps, ResourceProps } from '#admin/models'
import { SharedProps } from '@adonisjs/inertia/types'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { Link } from '@inertiajs/react'
import { Button, Group, Stack, Title } from '@mantine/core'
import ResourceTable from '~/components/admin/resource_table'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { Notifications } from '~/components/notifications'

export default function Resource(
  props: AdminProps & ResourceProps<LucidModel> & SharedProps
): JSX.Element {
  const computeNoInstanceActionPath = (action: ActionButton<LucidModel>) => {
    return `/admin/${props.resource.path}/${action.actionKey}`
  }

  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Title order={1}>{props.resource.label_plural}</Title>
          <Group>
            {props.noInstanceActions.map((action, index) => (
              <Button key={index} component={Link} href={computeNoInstanceActionPath(action)}>
                {action.label}
              </Button>
            ))}
          </Group>
        </Group>

        <ResourceTable {...props} />
      </Stack>

      <FatalErrorModal {...props} />
      <Notifications duration={props.settings.global.notificationsDuration} {...props} />
    </>
  )
}
