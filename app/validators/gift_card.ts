import SettingsService from '#services/settings_service'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { VALIDATION_REGEXES } from './rules/regexes.js'

const settings = await SettingsService.getAll()

const messagesProvider = new SimpleMessagesProvider({
  'cardQuantity.required': 'La quantité est obligatoire.',
  'cardQuantity.in': 'La quantité choisie n’est pas valide.',

  'cardPrice.required': 'Le prix est obligatoire.',
  'cardPrice.in': 'Le prix choisie n’est pas valide.',

  'email.required': 'L’adresse e-mail est obligatoire.',
  'email.trim': 'L’adresse e-mail n’est pas valide.',
  'email.email': 'L’adresse e-mail n’est pas valide.',
  'email.confirmed': 'Les deux champs doivent être identiques',

  'generalConditionsOfUse.required': 'Vous devez accepter les conditions générales d’utilisation.',
  'generalConditionsOfUse.literal': 'Vous devez accepter les conditions générales d’utilisation.',

  'phoneNumber.regex': 'Le numéro de  téléphone est invalide',
})

export const createGiftCardValidator = vine.compile(
  vine.object({
    cardQuantity: vine.string().trim().in(settings.buyGiftCards.cardQuantities),
    cardPrice: vine.string().trim().in(settings.buyGiftCards.cardPrices),
    email: vine.string().trim().email().confirmed({ confirmationField: 'emailConfirmation' }),
    phoneNumber: vine.string().trim().regex(VALIDATION_REGEXES.phone).nullable(),
    generalConditionsOfUse: vine.literal(true),
  })
)

createGiftCardValidator.messagesProvider = messagesProvider
