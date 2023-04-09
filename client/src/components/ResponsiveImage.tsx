import React, { ReactNode } from 'react'
import { Flex, chakra } from '@chakra-ui/react'
import Image from 'next/image'



interface BtnProps {
  className?: string
  alt?: string
  src: string
  w: number,
  h: number
  children?: ReactNode[] | ReactNode
}

const Base: React.FC<BtnProps> = (props) => {
  const {
    children,
    className,
    src,
    alt = 'Alt Text',
    w,
    h,
    ...rest
  } = props
  
  return (
    <>
      <Flex justify='center' width='100%' height='100%' className={className} style={{textDecoration: 'none', userSelect: 'none'}} >
        <Image {...rest} alt={alt} src={src} width={w} height={h}>{children}</Image> 
      </Flex>
    </>
  )
}


export const ResponsiveImage = chakra(Base, {
  shouldForwardProp: (prop) => true
})