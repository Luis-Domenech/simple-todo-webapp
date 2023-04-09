// Here we have funcs that are used in design

import { ResponsiveVal, RVOverload } from '../types'

/**
 * Returns an object that applies a certain responsive value to mobile and tablets and a separate responsive value to desktop.
 * @param base Value to pass to mobile & tablet designs
 * @param lg Value to pass to desktop designs
 * @returns An object that can be passed to Chakra components for responsive design.
 */
export const rv: RVOverload = (base: any, lg: any): ResponsiveVal<any> => {
  return {
    base: base,
    lg: lg
  }
}