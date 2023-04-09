import NavBar from './NavBar'
import { ReactNode, useEffect } from 'react'
import { Box, Flex, useColorMode } from '@chakra-ui/react'
// import css from '../styles/components/ContentContainer.module.scss'
import SideBar from '../components/SideBar'
import { rv } from '../utils/index'

type ContentContainerProps = {
  children?: ReactNode[] | ReactNode
}

const ContentContainer: React.FC<ContentContainerProps> = (props) => {
  const {
    children,
    ...rest
  } = props


  const { colorMode, toggleColorMode } = useColorMode()

  // useEffect(() => {
  //   // Older browsers may not have this
  //   if (typeof window.matchMedia !== 'undefined') {
  //     // Check user's preference at start
  //     const pref = window.matchMedia('(prefers-color-scheme: dark)')
  //     const prefColorMode = pref ? 'dark' : 'light'

  //     // Set color mode if it hasn't been set yet
  //     if (colorMode !== 'light' && colorMode !== 'dark') {
  //       if (setColorMode) setColorMode(prefColorMode)
  //     }

  //     // Now add an event listener for future changes
  //     // Runs anytime user changes their system color mode
  //     pref.addEventListener('change', e => {
  //       const newColorMode = e.matches ? 'dark' : 'light'
  //       // Only change if there was a change
  //       if (newColorMode !== colorMode && setColorMode) setColorMode(newColorMode)
  //     })
  //   }
  //   else {
  //     // Set color mode if it hasn't been set yet
  //     if (colorMode !== 'light' && colorMode !== 'dark') {
  //       setColorMode('light')
  //     }
  //   }
  // }, [])

  useEffect(() => {
    const bodyClass = window.document.body.classList
    
    if (colorMode === 'dark') {
      // if (!bodyClass.contains('dark')) 
      bodyClass.add('dark')
    }
    else {
      bodyClass.remove('dark')
    }

  }, [colorMode])
  

  return (
    <Box className={'content-container'} ml={rv('0vw', '5vw')} >
      <SideBar />
      <NavBar />
      {/* <div className='content-list'>
        <Post
          name='Ada'
          timestamp='one week ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
          ipsum dolor sit amet consectetur adipisicing elit.`}
        />
        <Post name='Leon' timestamp='one week ago' text={`Lorem ipsum dolor. `} />
        <Post name='Jill' timestamp='5 days ago' text={`Lorem.`} />
        <Post
          name='Ellie'
          timestamp='4 days ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. `}
        />
        <Post
          name='Chris'
          timestamp='4 days ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
          ipsum dolor sit amet consectetur adipisicing elit.
          
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
          ipsum dolor sit amet consectetur adipisicing elit.`}
        />
        <Post
          name='Claire'
          timestamp='2 days ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. `}
        />
        <Post
          name='Albert'
          timestamp='22 hours ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. ☺️ `}
        />
        <Post
          name='Rebecca'
          timestamp='3 hours ago'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit.`}
        />
        <Post
          name='H.U.N.K'
          timestamp='Just now'
          text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
          ipsum dolor sit amet consectetur adipisicing elit.`}
        />
      </div> */}
      {/* <BottomBar /> */}
      <Flex alignContent={'center'} justifyContent='center' flex={1} mt="8vh" pt="3vw" pb="3vw">        
        {children}
      </Flex>
    </Box>
  )
}

// const BottomBar = () => (
//   <div className='bottom-bar'>
//     <PlusIcon />
//     <input type='text' placeholder='Enter message...' className='bottom-bar-input' />
//   </div>
// )

// type PostProps = {
//   name: string
//   timestamp: string
//   text: string
// }

// const Post: React.FC<PostProps> = ({ name, timestamp, text }) => {

//   const seed = Math.round(Math.random() * 100)

//   return (
//     <div className={'post'}>
//       <div className='avatar-wrapper'>
//         <img src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`} alt='' className='avatar' />
//       </div>

//       <div className='post-content'>
//         <p className='post-owner'>
//           {name}
//           <small className='timestamp'>{timestamp}</small>
//         </p>
//         <p className='post-text'>{text}</p>
//       </div>
//     </div>
//   )
// }

// const PlusIcon = () => (
//   <BsPlusCircleFill
//     size='22'
//     className='mx-2 text-green-500 dark:shadow-lg dark:text-primary'
//   />
// )

export default ContentContainer
