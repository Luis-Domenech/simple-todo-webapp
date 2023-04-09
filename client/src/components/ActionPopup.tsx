import React, { useState } from 'react'
import { Flex, useDisclosure, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Modal, chakra, ModalContentProps, Spinner, useColorModeValue } from '@chakra-ui/react'

// Local Imports
import { ResponsiveText } from '../components/ResponsiveText'
import { rv } from '../utils'
import { Btn } from './Btn'
import { ResponsiveVal } from '../types'

type ActionPopupProps = {
  className?: string
  title: string
  question: string
  leftOption?: string
  leftProps?: React.ComponentProps<typeof Btn>
  leftAction?: (() => void) | (() => Promise<void>) | (() => boolean) | (() => Promise<boolean>)
  rightOption?: string
  rightProps?: React.ComponentProps<typeof Btn>
  rightAction?: (() => void) | (() => Promise<void>) | (() => boolean) | (() => Promise<boolean>)
  modalW?: ResponsiveVal<string>
  modalH?: ResponsiveVal<string>
  /** Parent component should handle when popup opens or not, so passing the result of useDisclosure() is essential. */
  disclosure: ReturnType<typeof useDisclosure>
  useLoading?: boolean
}

// Idea of component is to show a Modal with a title, question and be presented with two options which execute their respective passed functions
const Base: React.FC<ActionPopupProps & ModalContentProps> = (props) => {
  const {
    className,
    title,
    question,
    leftOption = 'No',
    leftProps = {},
    leftAction = () => {},
    rightOption = 'Yes',
    rightProps = {},
    rightAction = () => {},
    modalW = rv('20vw', '40vw'),
    modalH = rv('28vw', 'fit-content'),
    disclosure,
    useLoading = false,
    ...rest
  } = props

  // State
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)

  // Hooks
  const { isOpen, onOpen, onClose } = disclosure

  // Colors
  const spinner_color = useColorModeValue('white', 'white')

  const actionChosen = async (action: 'left' | 'right') => {
    // First, we execute the passed func and wait for it
    // After that, then we close the modal
    // This prevents some UX issues

    let shouldClose = undefined

    if (useLoading && action === 'left') setLeftLoading(true)
    if (useLoading && action === 'right') setRightLoading(true)

    // This works since if we await a normal func, it still executes without problem
    // // eslint-disable-next-line @typescript-eslint/await-thenable
    if (action === 'left') shouldClose = await leftAction()
    // // eslint-disable-next-line @typescript-eslint/await-thenable
    if (action === 'right') shouldClose = await rightAction()

    if (useLoading && action === 'left') setLeftLoading(false)
    if (useLoading && action === 'right') setRightLoading(false)

    if (typeof shouldClose === 'boolean') {
      // If function returns a boolean value, that value
      // determines whether we close the modal or not
      if (shouldClose) onClose()
    }
    else onClose()
  }

  return (
    <Flex style={{display: 'flex', flexDirection: 'column'}}>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay  />
        <ModalContent className={className} margin='auto' maxWidth={rv('80vw', '52vw')} w={modalW} h={modalH} {...rest}>
          <ModalHeader textAlign='center'>
            <ResponsiveText variant='h3' textAlign='center'>{title}</ResponsiveText>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <ResponsiveText variant='h4' textAlign='center'>{question}</ResponsiveText>
          </ModalBody>

          <ModalFooter>
            <Btn margin='auto' mt={rv('1vw', '1vw')} variant='main-color-mode' pad={rv('1vw 1vw', '1vw 1vw')} {...leftProps} onClick={() => actionChosen('left')}>
              { !leftLoading ?
                <ResponsiveText variant='smaller'>{leftOption}</ResponsiveText> :
                <Spinner mt={rv('-0.75vw', '-0.75vw')} size='md' color={spinner_color} />
              }
            </Btn>
            <Btn margin='auto' mt={rv('1vw', '1vw')} variant='main-color-mode' pad={rv('1vw 1vw', '1vw 1vw')} {...rightProps} onClick={() => actionChosen('right')}>
              { !rightLoading ?
                <ResponsiveText variant='smaller'>{rightOption}</ResponsiveText> :
                <Spinner mt={rv('-0.75vw', '-0.75vw')} size='md' color={spinner_color} />
              }
            </Btn>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export const ActionPopup = chakra(Base, {
  // Will forward all props passed to component
  shouldForwardProp: (prop) => true
})