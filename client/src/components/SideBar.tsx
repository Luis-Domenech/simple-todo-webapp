import { Box } from '@chakra-ui/layout'
import { useColorMode, Image, Divider } from '@chakra-ui/react'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'

// import Image from 'next/image'
import SideBarIcon from './SideBarIcon'
import { rv } from '../utils/index'

const SideBar = () => {

  const { colorMode, toggleColorMode } = useColorMode()


  const switchColorMode = () => {
    toggleColorMode()
  }

  return (
    <>
      <Box className={'sidebar'} w={'5vw'} display={rv('none', 'flex')} >
        
        <SideBarIcon href='/' text={'Home'} page={['/']} comp={<Image src='/img/favicon.png' width={26} height={26} />} />

        <Divider />

        { colorMode === 'light' ?
          <Box onClick={switchColorMode}> 
            <SideBarIcon text={'Dark Mode'} page='/test' comp={<BsMoonFill size='22' />} />
          </Box> :
          colorMode === 'dark' &&
          <Box onClick={switchColorMode}> 
            <SideBarIcon text={'Light Mode'} page='/test' comp={<BsSunFill size='22' />} />
          </Box>
        }
        
      </Box>
    </>

    
  )
}
export default SideBar