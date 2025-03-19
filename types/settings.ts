import { MantineColorsTuple } from '@mantine/core'

export type Settings = {
  global: {
    name: string
    primaryColor: MantineColorsTuple
    secondaryColor: MantineColorsTuple
    paymentCurrency: string
    mainSiteLink: string
    generalConditionLink: string
    contactLink: string
    newsLetterLink: string
    instagramLink: string
    emailDefaultFromAddress: string
    emailDefaultFromName: string
    passwordRelatedMailsFromAddress: string
    passwordRelatedMailsFromName: string
    notificationsDuration: number
  }
  buyGiftCards: {
    title: string
    description: string
    additionalInformations: string[]
    cardQuantities: string[]
    defaultCardQuantity: string
    cardPrices: string[]
    defaultCardPrice: string
    wantOthersPurchaseOptions: boolean
    confirmationMail: {
      subject: string
    }
  }
  giftCard: {
    expirationDateInMonths: number
  }
  displayPaymentSuccess: {
    tabTitle: string
    title: string
    description: string
  }
  login: {
    logoPath?: string
    description?: string
    wantContactLink: boolean
  }
  partnerLayout: {
    logoPath: string
    withBorder: boolean
    headerHeight: string
    navBarWidth: string
    navBarColor?: string
    headerColor?: string
    avatarColor?: string
  }
  searchGiftCard: {
    label: string
    placeholder: string
  }
  debitGiftCard: {
    description: string
  }
  guestLayout: {
    logoPath: string
    withBorder: boolean
    headerColor: string
    headerHeight: string
  }
}
