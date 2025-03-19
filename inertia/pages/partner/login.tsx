import { Title, Container, Stack, Text, Anchor, Center, Button } from '@mantine/core'
import { Head, Link } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'

import PartnerAuthController from '#controllers/partner/auth_controller'
import { LoginForm } from '~/forms/login_form'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { Alerts } from '~/components/alerts'

export default function PartnerLogin(
  props: InferPageProps<PartnerAuthController, 'showPartnerLoginView'>
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
            <Button variant="subtle" size="xs" component={Link} href={props.forgotPasswordPath}>
              J'ai oublié mon mot de passe
            </Button>

            {props.settings.login.description && (
              <Text ta="center">{props.settings.login.description}</Text>
            )}

            {props.settings.login.wantContactLink && (
              <Anchor
                href={props.settings.global.contactLink}
                target="_blank"
                underline="always"
                ml="sm"
                ta="center"
              >
                Contactez-nous !
              </Anchor>
            )}
          </Stack>
        </Container>
      </Center>
      {/* @ts-ignore */}
      <FatalErrorModal {...props} />
    </>
  )
}
