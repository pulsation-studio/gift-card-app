import { SharedProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Title, Text, Container, Stack, Alert, Anchor } from '@mantine/core'
import { BackButton } from '~/components/back_button'

export default function ServerError(props: SharedProps) {
  return (
    <>
      <Head title="Erreur serveur" />
      <Container size="xs" mt={40}>
        <BackButton href="/partner/home" label="Accueil" />
        <Stack gap="lg" align="center">
          <Alert color="red" title="Une erreur s'est produite">
            <Text c="red" ta="center">
              {props.fatalError?.message}
            </Text>
          </Alert>

          <Title order={2}>Oups, quelque chose ne va pas !</Title>

          <Text size="md" ta="center">
            Nous sommes désolés pour ce désagrément. Si vous avez besoin d'aide, vous pouvez nous
            contacter via le formulaire ci-dessous.
          </Text>

          <Anchor
            href={props.settings.global.contactLink}
            target="_blank"
            variant="outline"
            size="lg"
          >
            Contacter le support
          </Anchor>
        </Stack>
      </Container>
    </>
  )
}
