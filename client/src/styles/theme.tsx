import { ThemeConfig, extendTheme } from '@chakra-ui/react'


// Here we export global style options like colors
export const s = {
  green: 'rgb(0, 180, 0)',
  red: 'rgb(255, 0, 0)',
  drop_shadow: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))',
  black: '#1F1F1F',
  light_gray: '#DCE1EA',
  offwhite: '#FAF9F6',
  dark_gray: '#808080',
  white: '#FFFFFF',
  gray_fade: 'rgba(0, 0, 0, 0.65)',

  h1: {base: '11.5vw', lg: '6.5vw'},
  h2: {base: '9vw', lg: '4vw'},
  h3: {base: '7vw', lg: '3.2vw'},
  h4: {base: '6vw', lg: '1.75vw'},
  p: {base: '4.5vw', lg: '1.35vw'},
  p_small: {base: '4vw', lg: '1.25vw'},
  p_smaller: {base: '3vw', lg: '1vw'},
  p_smallest: {base: '2vw', lg: '0.75vw'},
  button_padding: {base: '4.8vw 5vw', lg: '1.75vw'},
  card_padding: {base: '9vw', lg: '3vw'},
  small_button_padding: {base: '4.8vw 5vw', lg: '1.40vw'},
  profile_card_padding: {base: '3vw', lg: '1vw'},
  
  'blue': 'rgb(22,60,95)',
  'blue-l': 'rgba(22,60,95,0.67)',
  'other-green': 'rgb(105,154,68)',
  'other-green-l': 'rgba(105,154,68,0.67)',
  'main': '#bb4817',
  'main-d': '#ff621f',
  'main-l': '#bb4817AA',
  'sec': '#4990ad',
  'sec-d': '#587480',
  'sec-l': '#779dadAA',
  
  // Here we overwrite chakra default gray colors
  gray: {
    900: '#202225',
    800: '#2f3136',
    700: '#36393f',
    600: '#4f545c',
    400: '#d4d7dc',
    300: '#e3e5e8',
    200: '#ebedef',
    100: '#f2f3f5',
  },

  chakra_green: '#48BB78',
  chakra_yellow: '#F6E05E',
  chakra_green_l: '#68D391AA',
  chakra_red: '#F56565',
  chakra_red_l: '#FC8181AA',
  gold: '#ccb94e',
  'gray-l': '#80808077'
}

const fonts = { 
  heading: '\'Titillium Web\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif, system-ui',
  body: '\'Titillium Web\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif, system-ui',
  mono: '\'Titillium Web\', monospace'
}

const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em'
}

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}
export const theme = extendTheme({
  config: config,
  colors: {
    black: '#16161D',
    'main': '#bb4817',
    'main-l': '#bb4817AA',
    'main-scheme': { // 500 is necessary to use this in colorScheme prop in Buttons anc Checkboxes and whatnot
      50: '#bb4817',
      100: '#bb4817',
      200: '#bb4817',
      300: '#bb4817',
      400: '#bb4817',
      500: '#bb4817',
      600: '#bb4817',
      700: '#bb4817',
      800: '#bb4817',
      900: '#bb4817',
    },
    'sec-scheme': { // 500 is necessary to use this in colorScheme prop in Buttons anc Checkboxes and whatnot
      50: '#779dad',
      100: '#779dad',
      200: '#779dad',
      300: '#779dad',
      400: '#779dad',
      500: '#779dad',
      600: '#779dad',
      700: '#779dad',
      800: '#779dad',
      900: '#779dad',
    },
    'sec': '#779dad',
    'sec-l': '#779dadAA',
    dark: {
      50: '#e8f0ff',
      100: '#cfd6e3',
      200: '#b5bccc',
      300: '#97a2b4',
      400: '#7b899d',
      500: '#626d84',
      600: '#4b5368',
      700: '#343a4b',
      800: '#1e2030',
      900: '#070718',
    },
    gray: {
      900: '#202225',
      800: '#2f3136',
      700: '#36393f',
      600: '#4f545c',
      400: '#d4d7dc',
      300: '#e3e5e8',
      200: '#ebedef',
      100: '#f2f3f5',
      50: 'rgb(249, 250, 251)'
    },
    primary:
    {
      100: '#D6D9FF',
      500: '#5320E2',
      900: '#1A0C4C' 
    },
    secondary:
    {
      50: '#ffe2fa',
      100: '#ffb1f4',
      200: '#ff7fed',
      300: '#ff4cea',
      400: '#ff1aea',
      500: '#e600d9',
      600: '#b4009e',
      700: '#810069',
      800: '#4f003a',
      900: '#1e0014',
    }
  },
  fonts: fonts,
  breakpoints: breakpoints,
  // See more about semanticTokens here: https://chakra-ui.com/docs/styled-system/semantic-tokens
  semanticTokens: {
    colors: {
      brand: {
        default: s['sec'],
        _dark: s['main']
      },
      text: {
        default: 'gray.700',
        _dark: 'white'
      },
      ph: {
        default: s['gray-l'],
        _dark: s['gray-l']
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.800'
      },
      lbg: {
        default: 'gray.100',
        _dark: 'gray.700'
      },
      dbg: {
        default: 'white',
        _dark: 'gray.900'
      },
      'light_text': {
        default: 'gray.400',
        _dark: 'gray.500'
      },
      border: {
        default: s['sec'],
        _dark: s['main']
      },
      'light_border': {
        default: s['sec-l'],
        _dark: s['main-l']
      },
      'color_scheme': {
        default: 'sec-scheme',
        _dark: 'main-scheme'
      },
      'disabled_border': {
        default: s.red,
        _dark: s.red
      },
      'read_only_border': {
        default: s.light_gray,
        _dark: s.dark_gray
      },
      'field_text': {
        default: 'gray.700',
        _dark: 'white'
      },
    }
  }
})



export default theme
