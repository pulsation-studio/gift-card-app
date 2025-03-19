import NewPasswordController from '#controllers/new_password_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Center, Container, Stack, Title } from '@mantine/core'
import { FatalErrorModal } from '~/components/fatal_error_modal'
import { NewPasswordForm } from '~/forms/new_password_form'

export default function NewPassword(props: InferPageProps<NewPasswordController, 'view'>) {
  return (
    <>
      <Head title="Nouveau mot de passe" />
      <Center h="80vh">
        <Container size="xs">
          <Title order={1}>Nouveau mot de passe</Title>
          <NewPasswordForm {...props} />
        </Container>
      </Center>
      <FatalErrorModal {...props} />
    </>
  )
}
