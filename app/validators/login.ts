import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'email.required': 'L’adresse e-mail est obligatoire.',
  'email.trim': 'L’adresse e-mail n’est pas valide.',
  'email.email': 'L’adresse e-mail n’est pas valide.',

  'password.required': 'Le mot de passe est obligatoire.',
  'password.trim': 'Le mot de passe ne doit pas contenir d’espaces inutiles.',
})

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)

loginValidator.messagesProvider = messagesProvider
