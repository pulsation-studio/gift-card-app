import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'password.required': 'Le mot de passe est obligatoire.',
  'password.regex':
    'Règles: au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial',
  'password.confirmed': 'Les deux champs doivent être identiques',
})

export const ResetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine
      .string()
      .trim()
      .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
      .confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

ResetPasswordValidator.messagesProvider = messagesProvider
