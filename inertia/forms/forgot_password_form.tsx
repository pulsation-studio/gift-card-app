import ForgotPasswordController from '#controllers/partner/forgot_password_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import { Button, Group, Loader, Stack, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { Alerts } from '~/components/alerts'

export interface ForgotPasswordFormValues {
  email: string
}

export function ForgotPasswordForm(props: InferPageProps<ForgotPasswordController, 'view'>) {
  const [isSubmitting, setSubmitting] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Adresse email invalide'),
    },
  })

  useEffect(() => {
    setSubmitting(false)
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props])

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    setSubmitting(true)
    router.post(props.forgotPasswordSubmitPath, { ...values })
  }
  return (
    <>
      <Alerts alerts={props.alerts} isReloading={isSubmitting} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="stretch" justify="center">
          <TextInput
            label="Votre adresse email"
            description=""
            {...form.getInputProps('email')}
            required
            error={form.errors.email}
          />
          <Group justify="center">
            <Button
              type="submit"
              w={{ base: '100%', sm: 'fit-content' }}
              disabled={isSubmitting}
              leftSection={isSubmitting ? <Loader size="xs" /> : undefined}
            >
              Réinitialiser le mot de passe
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  )
}
