import React, { ReactNode } from 'react'
import { Wrapper, WrapperVariant } from './Wrapper'

interface LayoutProps {
  variant?: WrapperVariant
  children?: ReactNode[] | ReactNode
}

export const Layout: React.FC<LayoutProps> = ({
  children, 
  variant
}) => {
  return (
    <> 
      <Wrapper variant={variant}>
        {children}
      </Wrapper>
      {/* <LumynalFooter /> */}
    </>
  )
}

export default Layout