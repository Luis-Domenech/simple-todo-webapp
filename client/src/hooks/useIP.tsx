import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { DEFAULT_STALE_TIME, __prod__ } from '../constants'
import { useBoundStore } from '../store/store'

// Query and store ip address in zustand state variable
export const useIp = () => {

  // Zustand
  const setIp = useBoundStore((store) => store.setIp)

  const getIp = async () => {
    try {
      // Get our ip address from a public api
      // We could get our ip address using SSR and getServerSideProps,
      // but this is way easier 
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      return data.ip
    }
    catch(e) {
      return ''
    }
  }

  const { data, isSuccess, ...rest } = useQuery(
    ['ip'],
    () => getIp(),
    {
      staleTime: DEFAULT_STALE_TIME, // Amount of time before we rerun getIp to update our stale data
      keepPreviousData: true // This is to keep the previous data just in case someone wants to go back to the previous page
    }
  )

  useEffect(() => {
    setIp('')

    if (isSuccess) {
      setIp(data)
    }
  }, [data, isSuccess])

  return { ...rest }
}