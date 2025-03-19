import { ActionBehavior, ActionButton, HttpMethod } from '#admin/models'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { router } from '@inertiajs/react'
import { FormEvent, useEffect, useState } from 'react'
import ConfirmationModal from '../confirmation_modal'
import { ActionButtonIcon } from './action_button_icon'
import { Button } from '@mantine/core'

interface HeadlessActionButtonProps {
  action: ActionButton<LucidModel, ActionBehavior.Headless>
  submitPath: string
}

export function HeadlessActionButton(props: HeadlessActionButtonProps) {
  const hasConfirmationModal = props.action.confirmationModal !== undefined

  const [buttonIsClicked, setButtonIsClicked] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = () => setIsModalOpen(false)
  const openModal = () => setIsModalOpen(true)

  const submitAndCloseModal = () => {
    submit()
    closeModal()
  }

  const submit = () => {
    setButtonIsClicked(true)
    const actionPath = props.submitPath

    const handleSubmitMethod = {
      [HttpMethod.GET]: () => router.get(actionPath),
      [HttpMethod.POST]: () => router.post(actionPath),
      [HttpMethod.DELETE]: () => router.delete(actionPath),
      [HttpMethod.PUT]: () => undefined,
      [HttpMethod.PATCH]: () => undefined,
    }

    handleSubmitMethod[props.action.method]()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (hasConfirmationModal) openModal()
    else submit()
  }

  useEffect(() => setButtonIsClicked(false), [props])

  return (
    <>
      <form onSubmit={handleSubmit} method={props.action.method} action={props.submitPath}>
        {props.action.buttonIcon ? (
          <ActionButtonIcon
            action={props.action}
            actionPath={props.submitPath}
            buttonIcon={props.action.buttonIcon}
            type="submit"
            isClicked={buttonIsClicked}
          />
        ) : (
          <Button type="submit">{props.action.label}</Button>
        )}
      </form>
      {props.action.confirmationModal !== undefined && (
        <ConfirmationModal
          message={props.action.confirmationModal.message}
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={submitAndCloseModal}
        />
      )}
    </>
  )
}
