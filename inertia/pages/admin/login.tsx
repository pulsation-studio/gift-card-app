import { Center, Container, Stack, Title } from '@mantine/core'
import { Head } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'

import { LoginForm } from '~/forms/login_form'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { Alerts } from '~/components/alerts'
import { AdminAuthController } from '#admin/controllers'

export default function AdminLogin(
  props: InferPageProps<AdminAuthController, 'showAdminLoginView'>
) {
  return (
    <>
      <Head title="Se connecter" />
      <Center h="100vh" w="100vw">
        <Container size="xs" w="var(--container-size)">
          <Stack align="stretch" justify="center">
            {props.settings.login.logoPath && (
              <img
                src={props.settings.login.logoPath}
                alt={'Logo de ' + props.settings.global.name}
                style={{ width: '50%', margin: 'auto' }}
              />
            )}

            <Title order={1} ta="center">
              Connexion
            </Title>

            <Alerts alerts={props.alerts} />

            {/* @ts-ignore */}
            <LoginForm {...props} />
          </Stack>
        </Container>
      </Center>
      {/* @ts-ignore */}
      <FatalErrorModal {...props} />
    </>
  )
}
