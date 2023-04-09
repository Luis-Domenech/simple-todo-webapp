import { useToast } from '@chakra-ui/react'
import { LONG_TOAST_DURATION, MID_TOAST_DURATION, SHORT_TOAST_DURATION } from '../constants'
import { ToastDuration, ToastStatus } from '../types'


export const useCustomToast = () => {
  const toast = useToast()

  const showToast = (
    message: string,
    description = '',
    status: ToastStatus = 'success',
    duration: ToastDuration | number = SHORT_TOAST_DURATION,
    isClosable = true
  ) => {
    let dur
    if (duration === 'SHORT') dur = SHORT_TOAST_DURATION
    else if (duration === 'REGULAR') dur = MID_TOAST_DURATION
    else if (duration === 'LONG') dur = LONG_TOAST_DURATION
    else dur = duration

    const temp: any = {}
    if (description) temp['description'] = description

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    toast({
      title: message,
      duration: dur,
      status: status,
      isClosable: isClosable,
      ...temp,
    })
  }

  const err = (
    message: string,
    description = '',
    duration: ToastDuration | number = 'LONG',
    isClosable = true
  ) => {
    showToast(message, description, 'error', duration, isClosable)
  }

  const warn = (
    message: string,
    description = '',
    duration: ToastDuration | number = 'LONG',
    isClosable = true
  ) => {
    showToast(message, description, 'warning', duration, isClosable)
  }

  const info = (
    message: string,
    description = '',
    duration: ToastDuration | number = 'LONG',
    isClosable = true
  ) => {
    showToast(message, description, 'info', duration, isClosable)
  }

  const ok = (
    message: string,
    description = '',
    duration: ToastDuration | number = 'LONG',
    isClosable = true
  ) => {
    showToast(message, description, 'success', duration, isClosable)
  }

  const loading = (
    message: string,
    description = '',
    duration: ToastDuration | number = 'REGULAR',
    isClosable = true
  ) => {
    showToast(message, description, 'loading', duration, isClosable)
  }

  return { err, warn, info, ok, loading }
}
