import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'name.required': 'Veuillez renseigner ce champ',
  'street.required': 'Veuillez renseigner ce champ',
  'postalCode.required': 'Veuillez renseigner ce champ',
  'postalCode.range': 'Un code postal a de 4 à 5 charactères',
  'postalCode.number': 'Ce champ ne peut avoir que des chiffres',
  'city.required': 'Veuillez renseigner ce champ',
  'iban.required': 'Veuillez renseigner ce champ',
  'iban.iban': 'IBAN invalide',
})

export const CreateShopValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    street: vine.string().trim(),
    postalCode: vine.number().range([1000, 99999]).withoutDecimals(),
    city: vine.string().trim(),
    iban: vine.string().trim().iban(),
  })
)

CreateShopValidator.messagesProvider = messagesProvider
