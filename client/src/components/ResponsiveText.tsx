import React, { ReactNode } from 'react'
import { chakra, Text } from '@chakra-ui/react'
import { s } from '../styles/theme'



export type ResponsiveTextVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'smaller' | 'smallest'

interface ResponsiveTextProps {
  variant?: ResponsiveTextVariants
  className?: string
  style?: any
  children?: ReactNode[] | ReactNode
  color?: string
}

const BaseResponsiveText: React.FC<ResponsiveTextProps> = (props) => {
  const {
    children,
    variant = 'h4',
    className,
    color,
    style = {},
    ...rest
  } = props

  const settings = {
    fontSize: s.p,
  }

  if (variant === 'h1') settings.fontSize = s.h1
  else if (variant === 'h2') settings.fontSize = s.h2
  else if (variant === 'h3') settings.fontSize = s.h3
  else if (variant === 'h4') settings.fontSize = s.h4
  else if (variant === 'p') settings.fontSize = s.p
  else if (variant === 'small') settings.fontSize = s.p_small
  else if (variant === 'smaller') settings.fontSize = s.p_smaller
  else if (variant === 'smallest') settings.fontSize = s.p_smallest
  
  return (
    // We cant do stuff like <Text><Text></Text></Text>
    // To circumvent that, treat text component as span, which can
    // be nested
    <Text as={'span'} color={color || 'text'} className={className} fontSize={settings.fontSize} style={style} {...rest}>
      {children}
    </Text>
  )
}


export const ResponsiveText = chakra(BaseResponsiveText, {
  shouldForwardProp: (prop) => true
})