import { useEffect } from 'react'
import { ChakraBaseProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import { AppProps } from 'next/app'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import 'aos/dist/aos.css'
import { Titillium_Web } from '@next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import '../styles/globals.scss'
import { useBoundStore } from '../store/store'
import { Chakra } from '../components/Chakra'

const font = Titillium_Web({ 
  weight: [
    // '200',
    '300',
    '400',
    '600',
    // '700',
    // '900'
  ],
  subsets: ['latin-ext'],
  style: [
    'normal',
    'italic'
  ]
})

const ContentContainer = dynamic(() => import('../components/ContentContainer'), { ssr: false })


interface Props extends AppProps {
  cookies?: any
}
const queryClient = new QueryClient()

const App: React.FC<Props> = ({ Component, pageProps, cookies }) => {

  const resetStore = useBoundStore((state) => state.resetStore)

  useEffect(() => {
    AOS.init({
      offset: 100,
    })
    
    // Reset entire zustand state
    resetStore()
  }, [])

  return (
    <Chakra cookies={pageProps.cookies}>
      <ChakraBaseProvider theme={theme}>
        <style jsx global>{`
          html {
            font-family: ${font.style.fontFamily};
          }
        `}</style>
        <QueryClientProvider client={queryClient}>
            <ContentContainer>
                <Component {...pageProps} />
            </ContentContainer>
        </QueryClientProvider>
      </ChakraBaseProvider>
    </Chakra>
  )
}

App.defaultProps = {
  
}

export default App