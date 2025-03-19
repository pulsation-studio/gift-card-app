import PurchaseGiftCardsController from '#controllers/guest/purchase_gift_cards_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Checkbox, NativeSelect, TextInput, Anchor, Flex, Button, Stack } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { router } from '@inertiajs/react'
import { useEffect } from 'react'
import { MdEuroSymbol } from '@react-icons/all-files/md/MdEuroSymbol'

export interface PurchaseGiftCardsFormValues {
  cardPrice: string
  cardQuantity: string
  email: string
  emailConfirmation: string
  phoneNumber: string
  generalConditionsOfUse: boolean
}

export function PurchaseGiftCardsForm(
  props: InferPageProps<PurchaseGiftCardsController, 'showGiftCardsPurchaseView'>
) {
  const form = useForm<PurchaseGiftCardsFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      cardQuantity: props.settings.buyGiftCards.defaultCardQuantity,
      cardPrice: props.settings.buyGiftCards.defaultCardPrice,
      email: '',
      emailConfirmation: '',
      phoneNumber: '',
      generalConditionsOfUse: false,
    },
    validate: {
      email: isEmail('Adresse email invalide'),
    },
  })

  useEffect(() => {
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props.errors])

  const handleSubmit = (values: PurchaseGiftCardsFormValues) => {
    router.post(props.initiatingPaymentSessionPath, { ...values })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1 }}>
      <Stack>
        <NativeSelect
          required
          label="Quantité"
          data={props.settings.buyGiftCards.cardQuantities}
          defaultValue={props.settings.buyGiftCards.defaultCardQuantity}
          {...form.getInputProps('cardQuantity')}
          error={form.errors.cardQuantity}
        />

        <NativeSelect
          required
          label="Montant"
          leftSection={<MdEuroSymbol />}
          data={props.settings.buyGiftCards.cardPrices}
          defaultValue={props.settings.buyGiftCards.defaultCardPrice}
          {...form.getInputProps('cardPrice')}
          error={form.errors.cardPrice}
        />

        {props.settings.buyGiftCards.wantOthersPurchaseOptions && (
          <Anchor href={props.settings.global.contactLink} target="_blank">
            Je souhaite offrir plusieurs cartes de différents montants
          </Anchor>
        )}

        <TextInput
          label="Votre adresse email"
          description="Cette adresse sera utilisée pour recevoir la ou les cartes-cadeaux."
          {...form.getInputProps('email')}
          required
          error={form.errors.email}
        />
        <TextInput
          label="Confirmation de l'adresse email"
          {...form.getInputProps('emailConfirmation')}
          required
          error={form.errors.emailConfirmation}
        />
        <TextInput
          label="Votre numéro de téléphone"
          description="Ce numéro ne sera utilisé que si nous détectons un problème sur l'envoi de la carte cadeau"
          {...form.getInputProps('phoneNumber')}
          required={false}
          error={form.errors.phoneNumber}
        />

        <Checkbox
          label={
            <>
              J'accepte les{' '}
              <Anchor href={props.settings.global.generalConditionLink} target="_blank">
                Conditions Générales d'utilisation
              </Anchor>
            </>
          }
          {...form.getInputProps('generalConditionsOfUse', { type: 'checkbox' })}
          required
          error={form.errors.generalConditionsOfUse}
        />

        <Flex justify={{ base: 'center', sm: 'flex-start' }}>
          <Button type="submit" w={{ base: '100%', sm: 'fit-content' }}>
            Confirmer
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}
