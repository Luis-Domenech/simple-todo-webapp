import { Box, useColorMode, useColorModeValue, Image } from '@chakra-ui/react'
import { useEffect } from 'react'


import { useBoundStore } from '../store/store'
import { s } from '../styles/theme'
import { ResponsiveText } from './ResponsiveText'
import { operation_fetch } from '../generated/lfd-client/client'
import { useRouter } from 'next/router'

import { rv } from '../utils'
import { Task } from '../generated/lfd-client/types'

const NavBar = () => {

  // Colors
  const textColor = useColorModeValue(s.black, s.offwhite)

  // Zustand
  const ip = useBoundStore((store) => store.ip)
  const setTasks = useBoundStore((store) => store.setTasks)

  // Every time our IP address changes, reset our tasks
  useEffect(() => {
    (async () => {
      if (ip) {
        const res = await operation_fetch('tasks', {ip: ip})
        
        if (res) {
          if (res.output) {
            if (res.output.data) {
              const new_tasks: Task[] = (res.output.data as any) as Task[]
              if (Array.isArray(new_tasks)) {
                setTasks(new_tasks)
              }
            }
          }
        }
      }
    })().catch(console.log)
  }, [ip])

  return (
    // <Box className={'navbar'} w={rv('100%', '95vw')} h='8vh' m={0}>
    <Box className={'navbar'} w={'100%'} h='8vh' m={0}>
      <Image src='/img/logo.png' width={218 * .75} height={68 * .75} ml={4} mr='auto' />
      <ResponsiveText ml={rv('5vw', '65vw')} className={'title-text'} color={textColor} variant='small'>{ip ? `IP: ${ip}` : ''}</ResponsiveText> 
      {/* <ResponsiveText display={rv('flex', 'none')} ml={rv('5vw', '2vw')} className={'title-text'} color={textColor}>ToDo</ResponsiveText>  */}
      
    </Box>
  )
}

export default NavBar