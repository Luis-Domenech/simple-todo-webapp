import React, { ReactNode } from 'react'
import { Button, chakra, Link, useColorMode } from '@chakra-ui/react'
import NextLink from 'next/link'
import { s } from '../styles/theme'



type LinkButtonVariants = 'main' | 'main-disabled' | 'inverse' | 'transparent' | 'main-light' | 'inverse-light' | 'transparent-light' | 'main-color-mode'

interface LinkButtonProps {
  variant?: LinkButtonVariants
  className?: any
  href: string
  pad?: string
  children?: ReactNode[] | ReactNode
  openInNewTab?: boolean
}

const BaseLinkButton: React.FC<LinkButtonProps> = (props) => {
  const { openInNewTab = false, pad, children, variant = 'main', className, href, ...rest } = props

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
      { openInNewTab ? 
        <Link target='_blank' rel='noopener noreferrer' {...rest} href={href} className={className} style={{textDecoration: 'none'}}>
          <Button _focus={{}} borderWidth={2} fontSize={s.p} width='fit-content' borderRadius='full' lineHeight={0} p={pad ?? s.button_padding} color={settings.color} borderColor={settings.borderColor} backgroundColor={settings.backgroundColor} variant='unstyled' _hover={{color: settings.hoverColor, backgroundColor: settings.hoverBackgroundColor, borderColor: settings.hoverBorderColor}}>{children}</Button> 
        </Link> :
        <NextLink href={href} passHref>
          <Link {...rest} className={className} style={{textDecoration: 'none'}}>
            <Button _focus={{}} borderWidth={2} fontSize={s.p} width='fit-content' borderRadius='full' lineHeight={0} p={pad ?? s.button_padding} color={settings.color} borderColor={settings.borderColor} backgroundColor={settings.backgroundColor} variant='unstyled' _hover={{color: settings.hoverColor, backgroundColor: settings.hoverBackgroundColor, borderColor: settings.hoverBorderColor}}>{children}</Button> 
          </Link>
        </NextLink> 
      }
    </>
  )
}


export const LinkBtn = chakra(BaseLinkButton, {
  // Will forward all props passed to component
  shouldForwardProp: (prop) => true
})