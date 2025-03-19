import { AlertIcon, AlertType, Alerts as AlertsProps } from '#types/alert'
import { Alert as MantineAlert, Stack, Text } from '@mantine/core'
import { MdInfo } from '@react-icons/all-files/md/MdInfo'
import { MdCheckCircle } from '@react-icons/all-files/md/MdCheckCircle'

export function Alerts({ alerts, isReloading }: { alerts?: AlertsProps; isReloading?: boolean }) {
  return (
    <>
      {alerts && !isReloading && (
        <Stack gap="md">
          {alerts.map((alert, index) => (
            <MantineAlert
              key={index}
              title={alert.title}
              color={getColor(alert.type)}
              icon={getIcon(alert.icon)}
              withCloseButton={alert.hasCloseButton}
            >
              <Text size="sm" c={getColor(alert.type)}>
                {alert.message}
              </Text>
            </MantineAlert>
          ))}
        </Stack>
      )}
    </>
  )
}

export function getIcon(type: AlertIcon) {
  switch (type) {
    case AlertIcon.INFO:
      return <MdInfo />
    case AlertIcon.CHECK:
      return <MdCheckCircle />
    case AlertIcon.NONE:
    default:
      return null
  }
}

export function getColor(type: AlertType) {
  switch (type) {
    case AlertType.ERROR:
      return 'red'
    case AlertType.SUCCESS:
      return 'green'
    case AlertType.INFORMATION:
    default:
      return 'blue'
  }
}
