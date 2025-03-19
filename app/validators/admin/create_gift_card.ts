import { VALIDATION_REGEXES } from '#validators/rules/regexes'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'expirationDate.required': 'Une valeur est requise',
  'expirationDate.date': 'Doit respecter le format',
  'expirationDate.date.after': 'Doit être au moins après demain',
  'ownerEmail.required': 'L’adresse e-mail est obligatoire.',
  'ownerEmail.trim': 'L’adresse e-mail n’est pas valide.',
  'ownerEmail.email': 'L’adresse e-mail n’est pas valide.',
  'startingAmount.required': 'Le prix est obligatoire.',
  'startingAmount.number': 'Le prix choisi n’est pas valide.',
  'startingAmount.positive': 'Le prix choisi doit être supérieur à 0.',
  'startingAmount.min': 'Le prix choisi doit être supérieur à 0.',
  'startingAmount.decimal': 'Le prix choisi doit avoir entre 0 et 2 décimales.',
  'ownerPhoneNumber.regex': 'Le numéro de  téléphone est invalide',
})

export const createAdminGiftCardValidator = vine.compile(
  vine.object({
    ownerEmail: vine.string().email(),
    ownerPhoneNumber: vine.string().trim().regex(VALIDATION_REGEXES.phone).nullable(),
    startingAmount: vine.number().positive().decimal([0, 2]).min(1),
    expirationDate: vine.date({ formats: { utc: true } }).after('tomorrow'),
  })
)

createAdminGiftCardValidator.messagesProvider = messagesProvider
