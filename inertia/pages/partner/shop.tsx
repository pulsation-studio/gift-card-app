import PartnerShopController from '#controllers/partner/shop_controller'
import { PartnerContextProps } from '#types/partner_context_props'
import { PartnerRoleLabel } from '#types/partner_roles'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import { Avatar, Badge, Button, Card, Flex, Group, Stack, Text, Title } from '@mantine/core'

import { MdList } from '@react-icons/all-files/md/MdList'
import { MdPerson } from '@react-icons/all-files/md/MdPerson'
import { AiOutlineShop } from '@react-icons/all-files/ai/AiOutlineShop'
import { FatalErrorModal } from '~/components/fatal_error_modal'

export default function Shop(
  props: InferPageProps<PartnerShopController, 'showPartnerShopView'> & PartnerContextProps
) {
  return (
    <>
      <Head title="Ma boutique" />
      <Stack>
        <Title order={1}>Ma boutique</Title>

        <Group justify="start" gap="md">
          <Avatar variant="filled" radius="xl" size="lg">
            <AiOutlineShop size={34} />
          </Avatar>
          <Stack justify="start" gap="xs">
            <Text fw={700} size="md">
              {props.shop.name}
            </Text>
            <Text size="md">{props.shop.address}</Text>
          </Stack>
        </Group>

        <Button
          size="md"
          justify="start"
          variant="default"
          leftSection={<MdList size={20} />}
          component={Link}
          href={props.transactionsPath}
        >
          Transactions
        </Button>

        <Title order={2} size="h3">
          Mon équipe
        </Title>
        <Flex justify="start" gap="md" direction={{ base: 'column', sm: 'row' }} wrap="wrap">
          {props.shop.staffLoadingError && <Text c="red">{props.shop.staffLoadingError}</Text>}
          {props.shop.staff &&
            props.shop.staff.map((partner) => (
              <Card shadow="sm" padding="lg" radius="md" withBorder key={partner.fullName}>
                <Group>
                  <MdPerson size={32} />
                  <Text size="sm">{partner.fullName}</Text>
                  <Badge size="md" ml="auto">
                    {PartnerRoleLabel[partner.shopRole]}
                  </Badge>
                </Group>
              </Card>
            ))}
        </Flex>
      </Stack>

      {/* @ts-ignore */}
      <FatalErrorModal {...props} />
    </>
  )
}
