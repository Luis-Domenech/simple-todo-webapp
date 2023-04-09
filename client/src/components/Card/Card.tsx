import { Box, useStyleConfig } from '@chakra-ui/react'

const Card: React.FC<any> = (props) => {
  const { variant, children, ...rest } = props
  const styles = useStyleConfig('Card', { variant })
  
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  )
}

export default Card