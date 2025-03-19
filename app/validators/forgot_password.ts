import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'email.required': 'L’adresse e-mail est obligatoire.',
  'email.trim': 'L’adresse e-mail n’est pas valide.',
  'email.email': 'L’adresse e-mail n’est pas valide.',
})

export const ForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

ForgotPasswordValidator.messagesProvider = messagesProvider
