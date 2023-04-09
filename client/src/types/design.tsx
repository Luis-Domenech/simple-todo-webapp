export type ResponsiveVal<T = string> = {
  base?: T,
  sm?: T
  md?: T
  lg?: T
  '2xl'?: T
} | T


export type RVOverload = {
  <T>(base: T, lg: T): ResponsiveVal<T>
}