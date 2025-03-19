import React from 'react'
import { Modal, Button, Text, Group, Stack } from '@mantine/core'

interface ConfirmationModalProps {
  message: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal opened={isOpen} onClose={onClose} withCloseButton={false} centered trapFocus={false}>
      <Stack>
        <Text ta="center">{message}</Text>
        <Group justify="center">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ConfirmationModal
