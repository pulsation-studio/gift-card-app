import { SharedProps } from '@adonisjs/inertia/types'
import { Modal, Text, Stack, Anchor } from '@mantine/core'
import { useEffect, useState } from 'react'

export function FatalErrorModal(props: SharedProps) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (props.fatalError?.id) setOpened(true)
  }, [props.fatalError?.id])

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack align="center" gap="lg">
        <Text c="red" ta="center" size="lg">
          {props.fatalError?.message}
        </Text>

        <Text ta="center" size="md">
          Si vous avez besoin d'aide, vous pouvez <br />
          <Anchor
            href={props.settings.global.contactLink}
            target="_blank"
            variant="outline"
            size="lg"
          >
            contacter le support
          </Anchor>
        </Text>
      </Stack>
    </Modal>
  )
}
