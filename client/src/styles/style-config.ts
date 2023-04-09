import { ResponsiveVal } from '../types'

export const st = {
  default_spacing: (factor?: ResponsiveVal<number>): ResponsiveVal<string> => {
    if (typeof factor === 'number') {
      return {
        base: `${5 * factor}vw`, 
        lg: `${2 * factor}vw`,
      }
    }
    else if (typeof factor === 'undefined') {
      return {
        base: '5vw',
        lg: '2vw',
      }
    }
    else {
      return {
        base: `${5 * (factor.base ?? 1)}vw`, 
        sm: factor.sm ? `${5 * (factor.sm ?? 1)}vw` : undefined,
        md: factor.sm ? `${5 * (factor.md ?? 1)}vw` : undefined,
        lg: `${2 * (factor.lg ?? 1)}vw`,
        '2xl': factor['2xl'] ? `${5 * (factor['2xl'] ?? 1)}vw` : undefined,
      }
    }
  }
}