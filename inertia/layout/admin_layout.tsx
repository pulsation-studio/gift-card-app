import { AdminProps } from '#admin/models'
import { MiddlewareProps } from '#types/middleware_props'
import { Head, Link, router } from '@inertiajs/react'
import { AppShell, Burger, Button, Flex, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PropsWithChildren } from 'react'
import { FiLogOut } from '@react-icons/all-files/fi/FiLogOut'

export default function AdminLayout(
  props: PropsWithChildren<AdminProps & MiddlewareProps>
): JSX.Element {
  const logout = () => router.post(props.logoutPath)
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
      <Head title={props.adminTitle} />
      <AppShell.Header bg={props.settings.guestLayout.headerColor}>
        <Flex align="center" justify="space-between" h="100%" px="lg">
          <img
            src={props.settings.guestLayout.logoPath}
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
        <AppShell.Section mb="lg">
          {props.menuProps.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              href={item.path}
              component={Link}
              variant="subtle"
              active
            />
          ))}
        </AppShell.Section>
        <AppShell.Section mt="auto">
          <Button
            fullWidth
            justify="center"
            variant="default"
            leftSection={<FiLogOut size={20} />}
            onClick={logout}
          >
            Se déconnecter
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  )
}
