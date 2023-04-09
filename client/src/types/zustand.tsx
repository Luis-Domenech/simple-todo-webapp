import { Task } from '../generated/lfd-client/types'

export type GeneralSlice = {
  ip: string
  tasks: Task[]
  setIp: (ip: string) => void
  setTasks: (tasks: Task[]) => void
  resetStore: () => void
}

export type ZustandState = GeneralSlice

export type ZustandStateVars = {
  // // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof ZustandState as ZustandState[Key] extends Function ? never : Key]: ZustandState[Key]
}


export type NormalResetVars = Pick<ZustandStateVars, 'ip' | 
  'tasks'
>