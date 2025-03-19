import settings from '#config/settings'
import { SettingsProps } from '#types/settings_props'
import { router } from '@inertiajs/react'
import { ActionIcon, BackgroundImage, Box, Group, Stack, Text, Input, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { MdCreditCard } from '@react-icons/all-files/md/MdCreditCard'
import { MdChevronRight } from '@react-icons/all-files/md/MdChevronRight'

export function SearchGiftCardComponent(props: { searchPath: string } & SettingsProps) {
  const [giftCardNumber, setNumber] = useState('')
  const [formattedGiftCardNumber, setFormattedNumber] = useState('')
  const [giftCardIsValid, giftCardNumberIsValid] = useState(false)
  const [isActionIconHovered, setActionIconIsHovered] = useState(false)

  const updateStates = (newNumber: string) => {
    const cleanedNumber = newNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

    const giftCardNumber = cleanedNumber
    const formattedGiftCardNumber = newNumber.endsWith('-')
      ? newNumber.slice(0, -1)
      : cleanedNumber.replace(/(.{3})/g, '$1-')

    giftCardNumberIsValid(giftCardNumber.length === 8)
    setFormattedNumber(formattedGiftCardNumber)
    setNumber(giftCardNumber)
  }

  const searchGiftCard = () => {
    router.get(`${props.searchPath}${giftCardNumber}`)
  }

  return (
    <Box c="white" w="100%" h="fit-content">
      <BackgroundImage src="/search_gift_card_background.webp" radius="lg" h="100%">
        <Stack align="center" justify="center" gap="md" p="lg">
          <Text size="24px" fw={600}>
            Carte-cadeau client
          </Text>
          <Text size="16px" fw={400}>
            {settings.searchGiftCard.label}
          </Text>
          <Group justify="center" w="100%" maw="500px">
            <Input
              size="md"
              radius="xl"
              placeholder={settings.searchGiftCard.placeholder}
              leftSection={<MdCreditCard size={18} />}
              value={formattedGiftCardNumber}
              maxLength={10}
              style={{ flex: 1 }}
              onChange={(event) => updateStates(event.currentTarget.value)}
              styles={{
                input: { textAlign: 'center' },
              }}
            />
            <Tooltip
              label="Un code de carte cadeau fait 10 caractères ( AAA-AAA-AA )"
              opened={!giftCardIsValid && isActionIconHovered}
              color="red"
            >
              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                color="gray"
                bg={giftCardIsValid ? 'var(--mantine-color-white)' : 'lightgray'}
                style={{ cursor: giftCardIsValid ? 'pointer' : 'not-allowed' }}
                onClick={giftCardIsValid ? searchGiftCard : undefined}
                onMouseEnter={() => setActionIconIsHovered(true)}
                onMouseLeave={() => setActionIconIsHovered(false)}
              >
                <MdChevronRight style={{ width: '50%', height: '50%' }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </BackgroundImage>
    </Box>
  )
}
