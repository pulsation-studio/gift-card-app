import { AppShell, Avatar, Burger, Flex, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PropsWithChildren } from 'react'
import { MiddlewareProps } from '#types/middleware_props'
import { PartnerContextProps } from '#types/partner_context_props'
import { Link } from '@inertiajs/react'

export default function PartnerLayout(
  props: PropsWithChildren<PartnerContextProps & MiddlewareProps>
): JSX.Element {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: props.settings.partnerLayout.headerHeight }}
      navbar={{
        width: props.settings.partnerLayout.navBarWidth,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      withBorder={props.settings.partnerLayout.withBorder}
    >
      <AppShell.Header bg={props.settings.partnerLayout.headerColor}>
        <Flex align="center" h="100%" px="lg">
          <img
            src={props.settings.partnerLayout.logoPath}
            width="218"
            height="51"
            alt={'Logo de ' + props.settings.global.name}
          />
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="md"
            ml="auto"
            color="primary"
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg={props.settings.partnerLayout.navBarColor}>
        {props.navConfig &&
          props.navConfig.map((item) => (
            <NavLink
              key={item.label}
              component={Link}
              label={item.label}
              href={item.path}
              variant="subtle"
              active
            />
          ))}

        <NavLink
          mt="auto"
          href={props.partnerAccountPath}
          component={Link}
          leftSection={
            <Avatar
              name={props.partner.fullName}
              color={props.settings.partnerLayout.avatarColor}
            />
          }
          label={props.partner.fullName || 'Utilisateur'}
        />
      </AppShell.Navbar>

      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}
