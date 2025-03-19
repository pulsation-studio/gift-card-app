import { InferPageProps } from '@adonisjs/inertia/types'
import { TextInput, Button, Stack, NumberInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { router } from '@inertiajs/react'
import DebitGiftCardController from '#controllers/partner/debit_gift_card_controller'
import { MdEuroSymbol } from '@react-icons/all-files/md/MdEuroSymbol'
import { MdCheck } from '@react-icons/all-files/md/MdCheck'
import ConfirmationModal from '~/components/confirmation_modal'
import { useEffect, useState } from 'react'

export interface DebitGiftCardFormValues {
  amount: number
  secretCode: string
  notes: string
}

export function DebitGiftCardForm(
  props: InferPageProps<DebitGiftCardController, 'showDebitGiftCardView'>
) {
  const form = useForm<DebitGiftCardFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      amount: props.giftCard.currentAmount,
      secretCode: '',
      notes: '',
    },
    validate: {
      amount: (value) => {
        if (value <= 0) return 'Le montant doit être supérieur à 0'
        if (value > props.giftCard.currentAmount) return `Montant supérieur à la valeur de la carte`
        if (!/^\d+(\.\d{1,2})?$/.test(value.toString()))
          return 'Le montant ne doit pas dépasser 2 décimales'
        return undefined
      },
      secretCode: (value) => {
        if (!/^\d{4}$/.test(value)) return 'Le code secret doit être composé de 4 chiffres'
        return undefined
      },
      notes: (value) => {
        if (value.length > 255) return 'La note ne doit pas dépasser 255 caractères'
        return undefined
      },
    },
  })

  useEffect(() => {
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props.errors])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openConfirmModal = () => {
    const isValid = !form.validate().hasErrors
    if (isValid) setIsModalOpen(true)
  }
  const closeModal = () => setIsModalOpen(false)

  const handleConfirm = () => {
    closeModal()
    form.onSubmit(handleSubmit)()
  }

  const handleSubmit = (values: DebitGiftCardFormValues) => {
    router.post(props.debitPath, { ...values })
  }

  const [textAreaCount, setTextAreaCount] = useState(form.getValues().notes.length)

  return (
    <form style={{ flex: 1 }}>
      <Stack w={{ base: '100%', md: '50%' }}>
        <NumberInput
          required
          label="Montant"
          rightSection={<MdEuroSymbol />}
          {...form.getInputProps('amount')}
          error={form.errors.amount}
        />

        <TextInput
          required
          label="Code Secret"
          {...form.getInputProps('secretCode')}
          error={form.errors.secretCode}
          inputMode="numeric"
          maxLength={4}
        />

        <Textarea
          label="Notes"
          description={`${textAreaCount}/255`}
          placeholder="Informations complémentaires..."
          {...form.getInputProps('notes')}
          onChange={(e) => {
            const value = e.target.value
            form.setFieldValue('notes', value)
            setTextAreaCount(value.length)
          }}
          error={form.errors.notes}
          autosize
          minRows={4}
        />

        <Button
          type="button"
          leftSection={<MdCheck />}
          w="fit-content"
          onClick={() => openConfirmModal()}
        >
          Valider
        </Button>
      </Stack>
      <ConfirmationModal
        message={`Voulez-vous vraiment effectuer ce débit de ${form.getValues().amount}€ ?`}
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </form>
  )
}
