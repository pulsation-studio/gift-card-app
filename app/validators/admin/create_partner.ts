import { PartnerRole } from '#types/partner_roles'
import { VALIDATION_REGEXES } from '#validators/rules/regexes'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'email.required': 'L’adresse e-mail est obligatoire.',
  'email.email': 'L’adresse e-mail n’est pas valide.',

  'password.required': 'Le mot de passe est obligatoire.',
  'password.regex':
    'Règles: au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial',
  'shopRole.enum': 'Valeur invalide',
  'shopRole.required': 'Un rôle doit être défini',
  'shopId.required': 'Une boutique doit être définie',
  'shopId.number': 'Valeur invalide',
  'phoneNumber.required': 'Le numéro de  téléphone est obligatoire',
  'phoneNumber.regex': 'Le numéro de  téléphone est invalide',
})

export const CreatePartnerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine.string().trim().email(),
    phoneNumber: vine.string().trim().regex(VALIDATION_REGEXES.phone),
    shopId: vine.number().withoutDecimals(),
    shopRole: vine.enum([PartnerRole.SALARY, PartnerRole.MANAGER]),
  })
)

CreatePartnerValidator.messagesProvider = messagesProvider
