// Here we have functions related to React

/**
 * Takes an async function and returns a non async version of it.
 * Useful when passing an async function to a component sincen components technically aren't supposed to accept async functions.
 * @param fn Function to wrap
 * @returns An async version of the passed function.
 */
export const wrapAsync = <ARGS extends unknown[]>(fn: (...args: ARGS) => Promise<unknown>): (...args: ARGS) => void => {
  return (...args) => {
    void fn(...args)
  }
}