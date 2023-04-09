import React, { ReactNode } from 'react'
import { Box, Button, chakra, ButtonProps, useColorMode } from '@chakra-ui/react'
import { s } from '../styles/theme'
import { ResponsiveText, ResponsiveTextVariants } from './ResponsiveText'
import { ResponsiveVal } from '../types'



type BtnVariants = 'main' | 'main-disabled' | 'inverse' | 'transparent' | 'main-light' | 'inverse-light' | 'transparent-light' | 'main-color-mode'


interface BtnProps {
  variant?: BtnVariants
  className?: string
  onClick?: () => void
  pad?: ResponsiveVal
  children?: ReactNode[] | ReactNode
  textVariant?: ResponsiveTextVariants
  tabIndex?: number
}

const BaseBtn: React.FC<BtnProps & Omit<ButtonProps, 'variant'>> = (props) => {
  const {
    children,
    textVariant = 'p',
    variant = 'main',
    className,
    onClick = () => {},
    tabIndex = 1,
    pad,
    ...rest
  } = props

  const { colorMode, toggleColorMode } = useColorMode()


  let settings = {
    color: {},
    backgroundColor: {},
    hoverColor: {},
    hoverBackgroundColor: {},
    borderColor: {},
    hoverBorderColor: {}
  }

  if (variant === 'main') settings = {
    ...settings,
    color: 'white',
    backgroundColor: s['main'],
    borderColor: s['main']
  }
  if (variant === 'main-disabled') settings = {
    ...settings,
    color: 'white',
    backgroundColor: s['main-l'],
    borderColor: s['main-l'],
  }
  else if (variant === 'inverse') settings = {
    ...settings,
    color: s['main'],
    backgroundColor: 'white',
    borderColor: 'white'
  }
  
  else if (variant === 'transparent') settings = {
    color: 'white',
    backgroundColor: 'transparent',
    borderColor: s['main'],
    hoverColor: 'white',
    hoverBackgroundColor: s['main'],
    hoverBorderColor: s['main']
  }

  else if (variant === 'main-light') settings = {
    ...settings,
    color: 'white',
    backgroundColor: s['main-l'],
    borderColor: s['main-l']
  }
  else if (variant === 'inverse-light') settings = {
    ...settings,
    color: s['main-l'],
    backgroundColor: 'white',
    borderColor: 'white'
  }
  else if (variant === 'transparent-light') settings = {
    color: 'white',
    backgroundColor: 'transparent',
    borderColor: s['main-l'],
    hoverColor: 'white',
    hoverBackgroundColor: s['main-l'],
    hoverBorderColor: s['main-l']
  }
  else if (variant === 'main-color-mode') {
    const bg = colorMode === 'light' ? s['sec'] : s['main']
    const bgHover = colorMode === 'light' ? s['sec-l'] : s['main-l']
    // const color = colorMode === 'light' ? s.lumynal_black : s.lumynal_white
    const color = 'white'
    const hoverColor = color
    settings = {
      color: color,
      backgroundColor: bg,
      borderColor: bg,
      hoverColor: hoverColor,
      hoverBackgroundColor: bgHover,
      hoverBorderColor: bgHover,
    }
  }

  return (
    <>
      <Box display={'flex'} justifyContent='center' alignContent={'center'} flexDir='column' className={className} style={{textDecoration: 'none'}}>
        {/* <Button _focus={{}} borderWidth={2} fontSize={s.p} width='fit-content' borderRadius='full' tabIndex={tabIndex} lineHeight={0} p={pad ?? s.button_padding} color={settings.color} borderColor={settings.borderColor} backgroundColor={settings.backgroundColor} variant='unstyled' _hover={{color: settings.hoverColor, backgroundColor: settings.hoverBackgroundColor, borderColor: settings.hoverBorderColor}} {...props}>{children}</Button>  */}
        <Button
          lineHeight={0}
          p={pad ?? s.button_padding}
          color={settings.color}
          borderColor={settings.borderColor}
          backgroundColor={settings.backgroundColor}
          _hover={{color: settings.hoverColor, backgroundColor: settings.hoverBackgroundColor, borderColor: settings.hoverBorderColor}}
          {...rest}
          _focus={{}}
          borderWidth={2}
          width='fit-content'
          borderRadius='full'
          tabIndex={tabIndex}
          variant='unstyled'
          onClick={onClick}
        >
          <ResponsiveText variant={textVariant}>
            {children}
          </ResponsiveText>
        </Button> 
      </Box>
    </>
  )
}


export const Btn = chakra(BaseBtn, {
  shouldForwardProp: (prop) => true
})