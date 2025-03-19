import { PartnerRole } from '#types/partner_roles'
import { VALIDATION_REGEXES } from '#validators/rules/regexes'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'email.required': 'L’adresse e-mail est obligatoire.',
  'email.email': 'L’adresse e-mail n’est pas valide.',
  'shopRole.enum': 'Valeur invalide',
  'shopRole.required': 'Un rôle doit être défini',
  'shopId.required': 'Une boutique doit être définie',
  'shopId.number': 'Valeur invalide',
  'phoneNumber.required': 'Le numéro de  téléphone est obligatoire',
  'phoneNumber.mobile': 'Le numéro de  téléphone est invalide',
})

export const UpdatePartnerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine.string().trim().email(),
    phoneNumber: vine.string().trim().regex(VALIDATION_REGEXES.phone),
    shopRole: vine.enum([PartnerRole.SALARY, PartnerRole.MANAGER]),
    shopId: vine.number().withoutDecimals(),
  })
)

UpdatePartnerValidator.messagesProvider = messagesProvider
