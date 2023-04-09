import create, { StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { GeneralSlice, NormalResetVars, ZustandState, ZustandStateVars } from '../types'
import { Task } from '../generated/lfd-client/types'


const default_state: ZustandStateVars = {
  ip: '',
  tasks: []
}

const normal_default_state: NormalResetVars = {
  ip: '',
  tasks: []
}


const createGeneralSlice: StateCreator<ZustandState, [['zustand/devtools', never], ['zustand/persist', unknown]], [], GeneralSlice> = (set) => ({
  ...default_state,
  setIp: (ip: string) => set((state) => ({ ip })),
  setTasks: (tasks: Task[]) => set((state) => ({ tasks })),
  resetStore: () => set((state) => ({ ...default_state })),
})




export const useBoundStore = create<ZustandState>()(
  devtools(
    persist(
      (...set) => ({
        ...createGeneralSlice(...set),
      }),
      {
        name: 'todo-app',
      }
    )
  )
)