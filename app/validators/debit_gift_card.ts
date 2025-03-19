import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'amount.required': 'Le montant est obligatoire.',
  'amount.positive': 'Le montant doit être supérieur à 0.',
  'amount.decimal': 'Le montant ne doit pas dépasser 2 décimales',
  'secretCode.required': 'Le code secret est obligatoire.',
  'secretCode.minLength': 'Le code secret doit contenir exactement 4 chiffres.',
  'secretCode.maxLength': 'Le code secret doit contenir exactement 4 chiffres.',
  'notes.maxLength': 'La note ne doit pas dépasser 255 caractères.',
})

export const debitGiftCardValidator = vine.compile(
  vine.object({
    amount: vine.number().positive().decimal([0, 2]),
    secretCode: vine.string().trim().minLength(4).maxLength(4),
    notes: vine.string().maxLength(255).nullable(),
  })
)

debitGiftCardValidator.messagesProvider = messagesProvider
