import { Stack, BackgroundImage, Text, Group, Box } from '@mantine/core'

export function GiftCard(props: {
  formattedGiftCardNumber: string
  currentAmount: number
  expirationDate: string
}) {
  return (
    <Box c="white" w={{ base: '100%', sm: 350 }} h="165px">
      <BackgroundImage src="/card.webp" radius="lg" h="100%">
        <Stack justify="space-around" p="md" h="100%">
          <Text size="13px" fw={400}>
            n°{props.formattedGiftCardNumber}
          </Text>
          <Text size="40px" fw={600}>
            {props.currentAmount} €
          </Text>
          <Group justify="space-between">
            <Text size="14px" fw={400}>
              Date d'expiration
            </Text>
            <Text size="14px" fw={400}>
              {props.expirationDate}
            </Text>
          </Group>
        </Stack>
      </BackgroundImage>
    </Box>
  )
}
