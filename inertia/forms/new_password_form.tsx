import NewPasswordController from '#controllers/new_password_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import { Button, Input, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { MdLock } from '@react-icons/all-files/md/MdLock'

export interface NewPasswordFormValues {
  password: string
  passwordConfirmation: string
  token: string
}

export function NewPasswordForm(props: InferPageProps<NewPasswordController, 'view'>) {
  const form = useForm<NewPasswordFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      passwordConfirmation: '',
      token: props.token,
    },
    validate: {
      password: (value) => (value ? null : 'Le champ est requis'),
      passwordConfirmation: (value, values) => {
        if (!value) return 'Mot de passe requis'
        if (values.password !== value) return 'Les deux champs doivent être identiques'
      },
    },
  })

  useEffect(() => {
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props.errors])

  const handleSubmit = (values: NewPasswordFormValues) => {
    router.post(props.newPasswordSubmitPath, { ...values })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack align="stretch" justify="center">
        <Input type="hidden" {...form.getInputProps('token')} />
        <PasswordInput
          leftSection={<MdLock />}
          placeholder="Mot de passe"
          required
          {...form.getInputProps('password')}
        />
        <PasswordInput
          leftSection={<MdLock />}
          placeholder="Vérifier le mot de passe"
          required
          {...form.getInputProps('passwordConfirmation')}
        />
        <Button type="submit">Confirmer</Button>
      </Stack>
    </form>
  )
}
