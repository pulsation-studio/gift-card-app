import { AppShell, Flex } from '@mantine/core'
import { PropsWithChildren } from 'react'
import { MiddlewareProps } from '#types/middleware_props'

export default function GuestLayout(props: PropsWithChildren<MiddlewareProps>): JSX.Element {
  return (
    <AppShell
      header={{ height: props.settings.guestLayout.headerHeight }}
      padding="md"
      withBorder={props.settings.guestLayout.withBorder}
    >
      <AppShell.Header bg={props.settings.guestLayout.headerColor}>
        <Flex align="center" h="100%" px="lg">
          <img
            src={props.settings.guestLayout.logoPath}
            width="218"
            height="51"
            alt={'Logo de ' + props.settings.global.name}
          />
        </Flex>
      </AppShell.Header>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}
