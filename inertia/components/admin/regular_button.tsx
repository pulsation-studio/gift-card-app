import { ActionBehavior, ActionButton } from '#admin/models'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { Button } from '@mantine/core'
import { ActionButtonIcon } from './action_button_icon'
import { useState } from 'react'
import { Link } from '@inertiajs/react'

interface RegularActionButtonProps {
  action: ActionButton<LucidModel, ActionBehavior.Regular>
  actionPath: string
}

export function RegularActionButton({ action, actionPath }: RegularActionButtonProps) {
  const [buttonIsClicked, setButtonIsClicked] = useState(false)

  return (
    <>
      {action.buttonIcon ? (
        <div onClick={() => setButtonIsClicked(true)}>
          <ActionButtonIcon
            action={action}
            actionPath={actionPath}
            buttonIcon={action.buttonIcon}
            component={Link}
            isClicked={buttonIsClicked}
          />
        </div>
      ) : (
        <Button component={Link} href={actionPath}>
          {action.label}
        </Button>
      )}
    </>
  )
}
