import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react'

/** 
 * Wrapper for App Component that adds Chakra related stuff to component.
 * Necessary if using SSR as server needs state of some chakra stuff in order to render correctly the html before sending it to the client.
 * See more [here](https://chakra-ui.com/docs/styled-system/color-mode).
 */
export function Chakra({ cookies, children }: any) {
  // b) Pass `colorModeManager` prop
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager

  return (
    <ChakraProvider colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  )
}

// also export a reusable function getServerSideProps
export function getServerSideProps({ req }: any) {
  return {
    props: {
      // first time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
      cookies: req.headers.cookie ?? '',
    },
  }
}