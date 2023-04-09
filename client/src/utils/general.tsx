import { currencyFormatter, defaultFormatter } from "../constants"

/**
 * Basically `time.sleep(ms)` from python.
 * @param ms Amount of time to sleep in milliseconds.
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

/**
 * A function that takes a string and return whether or not the string contains any string contained in the array provided.
 * @param target String to check
 * @param pattern Arry of strings to check for
 * @param case_sensitive If true, comparisons will be case_sensitive
 * @returns If target includes any pattern in the pattern array
 */
export const contains = (target: string, pattern: string[], case_sensitive = true): boolean => {
  if (!target) return false
  let found = false

  pattern.map(async (word) => {
    if (case_sensitive ? target.includes(word) : target.toLocaleLowerCase().includes(word.toLocaleLowerCase())) found = true
  })

  return found
}

// Great function for rounding float numbers to two decimal places. Mainly used for prices

/**
 * Rounds a number to passed decimals.
 * @param num Number to round.
 * @param decimals Amount of digits to round to. Default value is 2.
 * @returns A number that has been rounded to specified decimals.
 */
export const round = (num: any, decimals = 2): number => {
  if (!num) return 0
  if (typeof num === 'string') {
    try {
      return +(Math.round(parseFloat(num + `e+${decimals}`))  + `e-${decimals}`)
    }
    catch {
      return 0
    }
  }
  return +(Math.round(parseFloat(num + `e+${decimals}`))  + `e-${decimals}`)
}

/**
 * Takes a number and converts it to a `currency` format string or a default `format` string.
 * A `default` format string would parse the number `123456` to `123,456`.
 * @param num Number to format
 * @param format Format to format number to.
 * @returns A string of the formatted number
 */
export const formatNumber = (num: any, format: 'default' | 'currency' = 'default'): string => {
  // // default behaviour on a machine with a local that uses commas for numbers
  // let number = 1234567890;
  // number.toLocaleString(); // "1,234,567,890"

  // // With custom settings, forcing a "US" locale to guarantee commas in output
  // let number2 = 1234.56789; // floating point example
  // number2.toLocaleString('en-US', {maximumFractionDigits:2}); // "1,234.57"

  // //You can also force a minimum of 2 trailing digits
  // let number3 = 1.5;
  // number3.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}); //"1.50"

  // let number = 1234567890;
  // let nf = new Intl.NumberFormat('en-US');
  // nf.format(number); // "1,234,567,890"
  try {
    if (typeof num === 'number' || typeof num === 'bigint') {
      if (format === 'default') return defaultFormatter.format(num)
      else if (format === 'currency') return currencyFormatter.format(num)
      else return defaultFormatter.format(num)
    }
    else if (typeof num === 'string') {
      const n = parseFloat(num)
      if (format === 'default') return defaultFormatter.format(n)
      else if (format === 'currency') return currencyFormatter.format(n)
      else return defaultFormatter.format(n)
    }
    else return ''
  }
  catch(e) {
    return ''
  }
}

/**
 * Takes a currency formatted string and return a number.
 * @param num String number to parse.
 * @returns A number.
 */
export const currencyToNumber = (num: string): number | undefined => {
  try {
    if (typeof num === 'number') {
      return num
    }
    else if (typeof num === 'string') {
      return parseFloat((num).replace(/[$,%]+/gm, ''))
    }
    else return undefined
  }
  catch(e) {
    return undefined
  }
}