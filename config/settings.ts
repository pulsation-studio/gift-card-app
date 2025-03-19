import { Settings } from '#types/settings'

const settings: Settings = {
  global: {
    name: 'Pulsation',
    primaryColor: [
      '#fafaf8',
      '#d7f3f5',
      '#b3e5e7',
      '#8cd6da',
      '#6bc9ce',
      '#56c1c7',
      '#48bec4',
      '#38A0A4',
      '#26959a',
      '#0B6880',
    ],
    secondaryColor: [
      '#fff6e0',
      '#ffeccc',
      '#fdd89c',
      '#fbc268',
      '#f9b241',
      '#f8a41f',
      '#f89e0c',
      '#dd8900',
      '#c57a00',
      '#ab6800',
    ],
    paymentCurrency: 'eur',
    mainSiteLink: 'https://www.pulsation.eco/',
    generalConditionLink: 'https://www.pulsation.eco',
    contactLink: 'https://www.pulsation.eco/contact/',
    newsLetterLink: 'https://www.pulsation.eco',
    instagramLink: 'https://www.pulsation.eco',
    emailDefaultFromAddress: 'support@pulsation.eco',
    emailDefaultFromName: 'Pulsation',
    passwordRelatedMailsFromAddress: 'support@pulsation.eco',
    passwordRelatedMailsFromName: 'Pulsation',
    notificationsDuration: 4000,
  },
  buyGiftCards: {
    title: 'Offrir une carte Pulsation',
    description:
      'Distinguez-vous avec la carte-cadeau Pulsation ! LE cadeau idéal pour faire découvrir des acteurs locaux exceptionnels et engagés pour une consommation plus responsable dans les Alpes-Maritimes.',
    additionalInformations: [
      'Envoie par email en format numérique (PDF).',
      "À dépenser exclusivement dans l'ensemble du réseau des partenaires Pulsation, en une ou plusieurs fois, à l’euro près, sur présentation de la carte (en ligne ou imprimée).",
      "Non rechargeable, valable 1 an après la date d'achat",
    ],
    cardQuantities: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    defaultCardQuantity: '1',
    cardPrices: ['5', '10', '20', '30', '50', '80', '100', '150'],
    defaultCardPrice: '50',
    wantOthersPurchaseOptions: true,
    confirmationMail: {
      subject: 'Bravo ! Votre carte-cadeau responsable est arrivée !',
    },
  },
  giftCard: {
    expirationDateInMonths: 12,
  },
  displayPaymentSuccess: {
    tabTitle: 'Merci pour votre achat',
    title: 'Merci pour votre achat !',
    description:
      'Votre carte-cadeau Pulsation est en chemin, et devrait arriver dans votre boite email sous quelques minutes :)',
  },
  login: {
    logoPath: '/company_logo.webp',
    description: "Pas encore membre partenaire de l'asso ?",
    wantContactLink: true,
  },
  partnerLayout: {
    logoPath: '/company_logo_text.webp',
    withBorder: false,
    navBarColor: '#F8F8F8',
    headerColor: '#F8F8F8',
    avatarColor: 'primary',
    headerHeight: '80',
    navBarWidth: '250',
  },
  searchGiftCard: {
    label: 'Insérer l’identifiant de la carte-cadeau client',
    placeholder: 'Ex. 121-7C4-CA',
  },
  debitGiftCard: {
    description: 'Saisissez le montant à débiter de la carte-cadeau client Pulsation.',
  },
  guestLayout: {
    logoPath: '/company_logo_text.webp',
    withBorder: false,
    headerColor: '#F8F8F8',
    headerHeight: '80',
  },
}

export default settings
