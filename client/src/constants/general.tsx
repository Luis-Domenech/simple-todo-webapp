// General Settings
export const APP_NAME = 'ToDo'
export const __prod__: boolean = process.env.PROD === 'production'

export const UPDATE_INTERVAL = 3 * 1000 //ms
export const FETCH_DELAY = 3  * 1000
export const SHORT_TOAST_DURATION = 1000 //1sec
export const MID_TOAST_DURATION = 3000
export const LONG_TOAST_DURATION = 5000
export const DEFAULT_STALE_TIME = 2000 // Every X time, stale data and refetch data

export const isServer = () => typeof window === 'undefined'

export const AOS_ANIMATIONS = {
  'fade-up': 'fade-up',
  'fade-down': 'fade-down',
  'fade-left': 'fade-left',
  'fade-right': 'fade-right',
  'fade-up-right': 'fade-up-right',
  'fade-up-left': 'fade-up-left',
  'fade-down-right': 'fade-down-right',
  'fade-down-left': 'fade-down-left',
  'zoom-in': 'zoom-in',
  'zoom-in-up': 'zoom-in-up',
  'zoom-in-down': 'zoom-in-down',
  'zoom-in-left': 'zoom-in-left',
  'zoom-in-right': 'zoom-in-right',
  'zoom-out': 'zoom-out',
  'zoom-out-up': 'zoom-out-up',
  'zoom-out-down': 'zoom-out-down',
  'zoom-out-left': 'zoom-out-left',
  'zoom-out-right': 'zoom-out-right',
  'slide-up': 'slide-up',
  'slide-down': 'slide-down',
  'slide-right': 'slide-right',
  'slide-left': 'slide-left',
  'flip-left': 'flip-left',
  'flip-right': 'flip-right',
  'flip-up': 'flip-up',
  'flip-down': 'flip-down',
}

// To avoid recreating a formatted on every formatNumber, create a fomratted here and use it througout whole app
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

// Formats number like 123456 to 123,456
export const defaultFormatter = new Intl.NumberFormat('en-US')