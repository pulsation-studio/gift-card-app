import {
  NotificationIcon,
  NotificationType,
  Notifications as CustomNotifications,
} from '#types/notification'
import { Notification, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { MdClose } from '@react-icons/all-files/md/MdClose'
import { MdCheck } from '@react-icons/all-files/md/MdCheck'

export function Notifications({
  notifications,
  duration,
}: {
  notifications?: CustomNotifications
  duration: number
}) {
  const [areNotifsDisplayed, setNotifications] = useState(notifications)

  useEffect(() => setNotifications(notifications), [notifications])

  // remove notification one by on after 1.5s
  useEffect(() => {
    if (!areNotifsDisplayed || areNotifsDisplayed.length === 0) return

    const timer = setTimeout(() => {
      setNotifications((prev) => (prev ? prev.slice(1) : []))
    }, duration)

    return () => clearTimeout(timer)
  }, [areNotifsDisplayed])

  return (
    <>
      {areNotifsDisplayed && areNotifsDisplayed.length > 0 && (
        <Stack gap="md" m="lg" style={{ position: 'absolute', bottom: 0, right: 0 }}>
          {areNotifsDisplayed.map((notification, index) => (
            <Notification
              key={index}
              title={notification.title}
              color={getColor(notification.type)}
              icon={getIcon(notification.icon)}
              withCloseButton={notification.hasCloseButton}
            >
              {notification.message}
            </Notification>
          ))}
        </Stack>
      )}
    </>
  )
}

export function getIcon(type: NotificationIcon) {
  switch (type) {
    case NotificationIcon.CROSS:
      return <MdClose />
    case NotificationIcon.CHECK:
      return <MdCheck />
    case NotificationIcon.NONE:
    default:
      return null
  }
}

export function getColor(type: NotificationType) {
  switch (type) {
    case NotificationType.ERROR:
      return 'red'
    case NotificationType.SUCCESS:
      return 'green'
    case NotificationType.INFORMATION:
    default:
      return 'blue'
  }
}
