import { ActionButton, ButtonIcon } from '#admin/models'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { Link } from '@inertiajs/react'
import { ActionIcon, Loader, Tooltip } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getIcon } from './admin_icons'

interface ActionButtonIconProps {
  buttonIcon: ButtonIcon
  action: ActionButton<LucidModel>
  actionPath: string
  component?: typeof Link
  type?: string
  isClicked: boolean
}

export function ActionButtonIcon({
  buttonIcon,
  action,
  actionPath,
  component,
  type,
  isClicked,
}: ActionButtonIconProps) {
  const [IconComponent, setIconComponent] = useState<JSX.Element | null>(null)
  useEffect(() => {
    const iconLibrary = buttonIcon.iconLibrary
    const iconName = buttonIcon.iconName

    const iconPromise = getIcon(iconLibrary, iconName)

    iconPromise.then((icon) => setIconComponent(icon))
  }, [])

  return (
    <Tooltip label={action.label}>
      <ActionIcon
        component={component}
        href={actionPath}
        type={type ?? 'button'}
        disabled={isClicked}
      >
        {isClicked && <Loader size="xs" />}
        {!isClicked && IconComponent !== null && IconComponent}
      </ActionIcon>
    </Tooltip>
  )
}
