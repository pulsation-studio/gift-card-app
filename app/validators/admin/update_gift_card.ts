import { VALIDATION_REGEXES } from '#validators/rules/regexes'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'expirationDate.required': 'Une valeur est requise',
  'expirationDate.date': 'Doit respecter le format',
  'expirationDate.date.after': 'Doit être au moins après demain',
  'ownerEmail.required': 'L’adresse e-mail est obligatoire.',
  'ownerEmail.trim': 'L’adresse e-mail n’est pas valide.',
  'ownerEmail.email': 'L’adresse e-mail n’est pas valide.',
  'ownerPhoneNumber.regex': 'Le numéro de  téléphone est invalide',
})

export const UpdateGiftCardValidator = vine.compile(
  vine.object({
    ownerEmail: vine.string().email(),
    ownerPhoneNumber: vine.string().trim().regex(VALIDATION_REGEXES.phone).nullable(),
    expirationDate: vine.date({ formats: { utc: true } }).after('tomorrow'),
  })
)

UpdateGiftCardValidator.messagesProvider = messagesProvider
