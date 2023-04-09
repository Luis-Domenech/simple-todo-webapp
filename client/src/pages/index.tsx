import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

// Local Imports
import { useRouter } from 'next/router'
import { useBoundStore } from '../store/store'
import { Box, Flex, Spinner, useColorModeValue } from '@chakra-ui/react'
import { ResponsiveText } from '../components/ResponsiveText'
import { useFormikForm } from '../hooks/useFormikForm'
import { z } from 'zod'
import { FormikInput } from '../components/FormikField/FormikInput'
import { AOS_ANIMATIONS } from '../constants'
import { FormikSubmitBtn } from '../components/FormikField/FormikSubmitBtn'
import { s } from '../styles/theme'
import { useCustomToast } from '../hooks/useCustomToast'
import { operation_fetch } from '../generated/lfd-client/client'
import { Task } from '../generated/lfd-client/types'
import { useIp } from '../hooks/useIP'
import { sleep } from '../utils'

// Define form input types as a zod object
const FormSchema = z.late.object(() => ({
  task: z.string().min(2).max(32)
}))

// Convert the zod object into a TS type
type FormSchema = z.infer<typeof FormSchema>

const Home: NextPage = () => {

  // State
  const [loading, setLoading] = useState(false) // Used to know when we are querying server

  // Hooks
  const { ok, err } = useCustomToast()
  const {} = useIp()

  // Zustand
  const ip = useBoundStore((state) => state.ip)
  const tasks = useBoundStore((state) => state.tasks)
  const setTasks = useBoundStore((state) => state.setTasks)

  // Colors
  const spinner_color = useColorModeValue('sec-l', 'main-l')


  // Formik
  const formik = useFormikForm({
    form_schema: FormSchema,
    submit: async (values) => {
      await add_task(values.task)
    }
  })

  const check_task = async (task: string) => {
    setLoading(true)

    try {
      const res = await operation_fetch('check_task', {
        ip: ip,
        task: task
      })

      if (res) {
        if (res.output) {
          if (res.output.data) {
            const new_tasks = (res.output.data as any) as Task[]

            // Do validation here
            const find = new_tasks.find(t => t.task === task)

            if (find) {
              // Now check if the task was checked
              if (find.checked) {
                ok('Task Checked!')
             
                // Overwrite tasks state
                setTasks([...new_tasks])

                setLoading(false)
              
                return
              }
            }
          }
        }
      }

      err('Error!', 'Error checking task')
      setLoading(false)
    }
    catch(e) {
      console.log(e)
      err('Error!', 'Error checking task')
      setLoading(false)
    }
  }

  const uncheck_task = async (task: string) => {
    setLoading(true)

    try {
      const res = await operation_fetch('uncheck_task', {
        ip: ip,
        task: task
      })

      if (res) {
        if (res.output) {
          if (res.output.data) {
            const new_tasks = (res.output.data as any) as Task[]

            // Do validation here
            const find = new_tasks.find(t => t.task === task)

            if (find) {
              // Now check if the task was unchecked
              if (!find.checked) {
                ok('Task Unchecked!')
             
                // Overwrite tasks state
                setTasks([...new_tasks])

                setLoading(false)
              
                return
              }
            }
          }
        }
      }

      err('Error!', 'Error unchecking task')
      setLoading(false)
    }
    catch(e) {
      console.log(e)
      err('Error!', 'Error unchecking task')
      setLoading(false)
    }
  }

  const add_task = async (task: string) => {
    setLoading(true)

    try {
      // First we check if task already exists
      const find = tasks.find(t => t.task === task)

      if (find) {
        err('Error!', 'Task already added')
        setLoading(false)
        return
      }

      const res = await operation_fetch('add_task', {
        ip: ip,
        task: task
      })

      if (res) {
        if (res.output) {
          if (res.output.data) {
            const new_tasks = (res.output.data as any) as Task[]

            // Do validation here
            const find = new_tasks.find(t => t.task === task)

            if (find) {
              ok('Success!', 'Task was added.')
             
              // Overwrite tasks state
              setTasks([...new_tasks])

              // Reset form since task was added
              formik.resetForm()
              
              setLoading(false)
             
              return
            }
          }
        }
      }

      err('Error!', 'Error adding task')
      setLoading(false)
    }
    catch(e) {
      console.log(e)
      err('Error!', 'Error adding task')
      setLoading(false)
    }
  }

  const remove_task = async (task: string) => {
    setLoading(true)

    try {
      const res = await operation_fetch('remove_task', {
        ip: ip,
        task: task
      })

      if (res) {
        if (res.output) {
          if (res.output.data) {
            const new_tasks = (res.output.data as any) as Task[]

            // Do validation here
            const find = new_tasks.find(t => t.task === task)

            if (!find) {
              // If there was task found, then task was removed succesfully
              ok('Success!', 'Task was removed.')
              
              // Overwrite tasks state
              setTasks([...new_tasks])

              setLoading(false)
              return
            }
          }
        }
      }

      err('Error!', 'Error removing task')
      setLoading(false)
    }
    catch(e) {
      console.log(e)
      err('Error!', 'Error removing task')
      setLoading(false)
    }
  }

  return (
    <>
      <Flex data-aos={AOS_ANIMATIONS['fade-up']} bg='bg' w='40%' h='80vh' borderRadius={'2vw'} flexDir={'column'} padding='2vw'>
        <Flex justifyContent={'center'}>
          <ResponsiveText variant='h2' fontWeight={'400'} textAlign={'center'}>Todo List</ResponsiveText>
        </Flex>
        <Flex mt='3vw' w='100%' justifyContent={'center'} alignItems={'center'}>
          <form onSubmit={formik.handleSubmit}>
            <Flex w='100%' flexDir={'row'}>
                <Box w='23vw'>
                  <FormikInput h='2.5vw' tabIndex={1} ph_text='Add a task...' id='task' field_type='text' formik={formik} />
                </Box>
                <FormikSubmitBtn ml='1.5vw' textVariant='smaller' h='2.5vw' pad='1.25vw 1.5vw' tabIndex={2} text='Add Task' formik={formik}/>
            </Flex>
          </form>
        </Flex>

        <Flex w='100%' h={tasks.length ? '100%' : '0%'} overflowX={'hidden'} flexDir={'column'}>
          {tasks ? 
            <>
              {/* { [...tasks, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'Cool', checked: false}, {task: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', checked: false}].map((task, index) => ( */}
              { tasks.map((task, index) => (
                <>
                 <Flex key={task.task} mt={index > 0 ? '1vw' : ''} borderRadius={'0.5vw'} bg='dbg' h='3vw' w='100%' justifyContent={'center'} alignItems={'center'}>
                  <Flex h='3vw' w='100%' flexDir={'row'}>
                      <Flex w='23.5vw' ml='1vw' alignItems={'center'}>
                        <ResponsiveText variant='small'>{task.task}</ResponsiveText>
                      </Flex>
                      
                      <Flex ml='2vw'>
                        { loading ?
                          <>
                            <Flex ml='1.5vw' justifyContent={'center'} p='0.25vw' alignItems={'center'} borderRadius={'100%'}>
                              <Spinner size='lg' color={spinner_color} />
                            </Flex>
                          </> :
                          <>
                            { task.checked ?
                              <>
                                <Flex onClick={() => uncheck_task(task.task)} alignSelf={'center'} h='70%' _hover={{cursor: 'pointer'}} justifyContent={'center'} p='0.25vw' alignItems={'center'} borderRadius={'100%'} borderColor={s.chakra_green} borderWidth={2}>
                                  <AiOutlineCheck size='20' color={s.chakra_green} />
                                </Flex>
                              </> :
                              <>
                                <Flex onClick={() => check_task(task.task)} alignSelf={'center'} h='70%' _hover={{cursor: 'pointer'}} justifyContent={'center'} p='0.25vw' alignItems={'center'} borderRadius={'100%'} borderColor={s['gray-l']} borderWidth={2}>
                                  <AiOutlineCheck size='20' color={s['gray-l']} />
                                </Flex>
                              </>
                            }
                            <Flex onClick={() => remove_task(task.task)} alignSelf={'center'} ml='1vw' h='70%' _hover={{cursor: 'pointer'}} justifyContent={'center'} p='0.25vw' alignItems={'center'} borderRadius={'100%'} borderColor={s.chakra_red} borderWidth={2}>
                              <AiOutlineClose size='20' color={s.chakra_red} />
                            </Flex>
                          </>
                        }
                      </Flex>
                  </Flex>
                </Flex>
                </>
              ))
              }
            </>  :
            <></>
          }
        </Flex>
        
      </Flex>
    </>
  )
}

export default Home