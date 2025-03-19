import { TextInput, Button, Stack, PasswordInput } from '@mantine/core'
import { useForm, isEmail } from '@mantine/form'
import { router } from '@inertiajs/react'
import { SharedProps } from '@adonisjs/inertia/types'
import { MdLock } from '@react-icons/all-files/md/MdLock'
import { MdEmail } from '@react-icons/all-files/md/MdEmail'
import { useEffect } from 'react'

export interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm(props: { loginPath: string } & SharedProps) {
  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Adresse email invalide'),
      password: (value) => (value ? null : 'Mot de passe requis'),
    },
  })

  useEffect(() => {
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props.errors])

  const handleSubmit = (values: LoginFormValues) => {
    router.post(props.loginPath, { ...values })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1 }}>
      <Stack>
        <TextInput
          leftSection={<MdEmail />}
          placeholder="Adresse email"
          required
          {...form.getInputProps('email')}
        />

        <PasswordInput
          leftSection={<MdLock />}
          placeholder="Mot de passe"
          required
          {...form.getInputProps('password')}
        />

        {/* <Anchor href="/forgot-password" size="sm">
          Mot de passe oublié ?
        </Anchor> */}

        <Button type="submit">Se connecter</Button>
      </Stack>
    </form>
  )
}
