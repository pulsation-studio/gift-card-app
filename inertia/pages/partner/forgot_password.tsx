import PasswordResetController from '#controllers/partner/forgot_password_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Center, Container, Stack, Title } from '@mantine/core'
import { BackButton } from '~/components/back_button'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { ForgotPasswordForm } from '~/forms/forgot_password_form'

export default function ForgotPassword(props: InferPageProps<PasswordResetController, 'view'>) {
  return (
    <>
      <Head title="Mot de passe oublié" />

      <Center h="80vh">
        <Container size="xs">
          <Stack align="stretch" justify="center">
            <BackButton label={'Connexion'} href={props.loginPath} />
            <Title order={1}>Mot de passe oublié?</Title>
            <ForgotPasswordForm {...props} />
          </Stack>
        </Container>
      </Center>
      {/* @ts-ignore */}
      <FatalErrorModal {...props} />
    </>
  )
}
