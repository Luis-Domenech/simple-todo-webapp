import React, { useEffect, useRef, useState } from 'react'
import { chakra, Box, Input, InputProps, Spinner, FormLabel, BoxProps } from '@chakra-ui/react'
import { useCustomToast } from '../../hooks/useCustomToast'
import { create_date, getFileHashBrowser, isoToDate, rv, wrapAsync } from '../../utils'
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, PRESIGNED_URL_LOW_TIME_THREHSOLD } from '../../constants'
import { useBoundStore } from '../../store/store'
import { operation_fetch } from '../../generated/lfd-client/client'
import { FRA_Folder, PresignedURLInfo } from '../../generated/lfd-client/types'
import { ResponsiveText } from '../ResponsiveText'
import { Btn } from '../Btn'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { st } from '../../styles/style-config'
import { BaseFormikForm } from '../../types'

interface FormikFileUpdateInputProps {
  className?: string
  file_key: string | undefined
  label?: string | undefined
  tabIndex: number
  id: string
  file_folder: FRA_Folder
  input_pos?: number
  
  eprops?: BoxProps

  /**
  * Formik handler onChange event is still fired. Afterwards, this would be called
  */
  onChange?: {
    (e: React.ChangeEvent<HTMLInputElement>): (void) | (Promise<void>);
    <T = string | React.ChangeEvent<HTMLInputElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLInputElement>) => (void) | (Promise<void>);
  }

  formik: BaseFormikForm
  tooltip?: string
}

type FormikFileUpdateInputState = 'setting_up' | 'waiting_for_key' | 'getting_signed_url' | 'uploading' | 'ready'

const Base: React.FC<FormikFileUpdateInputProps & InputProps> = (props) => {
  const {
    eprops = {},
    file_folder,
    id,
    file_key,
    label = undefined,
    tabIndex,
    className,
    input_pos = undefined,
    onChange = undefined,
    formik,
    tooltip = undefined,
    mb = st.default_spacing(1),
    ...rest
  } = props

  const {
    values,
    errors,
    touched,
    isSubmitting,
    getFieldHelpers,
  } = formik

  
  // Hooks
  const {err, ok, info} = useCustomToast()
  const input_ref = useRef(null)

  // State Variables
  const [state, setState] = useState<FormikFileUpdateInputState>('getting_signed_url')
  const [file, setFile] = useState<File>()
  const [content_type, setContentType] = useState<string>('application/pdf')
  const [uploads, setUploads] = useState<number>(0)
  
  // Zustand
  const fra_account_id = useBoundStore((state) => state.account_id)
  const presigned_urls = useBoundStore((state) => state.presigned_urls)
  const addSignedURL = useBoundStore((state) => state.addSignedURL)

  const text_to_show = () => {
    if (state === 'getting_signed_url') {
      return (<Spinner mt={rv('-0.5vw', '-0.5vw')} size='md' color='white' />)
    }
    else if (state === 'setting_up') {
      return (<Spinner mt={rv('-0.5vw', '-0.5vw')} size='md' color='white' />)
    }
    else if (state === 'uploading') {
      return (<Spinner mt={rv('-0.5vw', '-0.5vw')} size='md' color='white' />)
    }
    else if (state === 'ready') {
      if (uploads > 0) return (<ResponsiveText variant='smaller'>Reupload</ResponsiveText>)
      else return (<ResponsiveText variant='smaller'>Upload</ResponsiveText>)
    }
    else if (state === 'waiting_for_key') {
      null
    }
    return null
  }

  const error = errors[id]

  const hasError = () => {
    try {
      if (error) {
        if (typeof error === 'string') {
          if (error === 'Required') return false
          return error.length > 0 && touched[id] && state === 'ready'
        }
        else if (Array.isArray(error)) return error.length > 0 && touched[id] && state === 'ready'
      }
    }
    catch {
      return false
    }
    return false
  }


  useEffect(() => {
    (async () => {
      if (state === 'setting_up') {
        // Reset input value everytime we reset
        // This makes erropr checking kinda work
        if (id && getFieldHelpers) {
          // input.value === ''
          getFieldHelpers(id).setValue('')
        }
        
        // We check if any signed url exists because if there is,
        // then we are probably a rerendered component with a new id
        // In such, case, we don't need to fetch signed url since we 
        // already have one
  
        // However, we check signed url's time expire timestamp to see if url we have on
        // hashmap has expired or not
        if (!file_key) {
          setState('waiting_for_key')
          return
        }
        else {
          if (presigned_urls[id]) {
            // const params = new Proxy(new URLSearchParams(presigned_urls.get(id)), {
            //   get: (searchParams, prop) => {
            //     if (typeof prop === 'string') {
            //       return searchParams.get(prop)
            //     }
            //     else {
            //       return searchParams.get(prop.toString())
            //     }
            //   },
            // })
            // const creation_date = parse_ics_date(params.get('X-Amz-Date') ?? new Date().toISOString().replace(/[-]+/g, ''))
            
            // let is_expired = false
    
            // if (typeof creation_date === 'string') is_expired = true
            // else {
            //   const expiry_date = add_to_date(creation_date, 0, 0, 0, 0, 0, parseInt(`${params.get('X-Amz-Expires') ?? (30 * 60 * 1000)}`)) // 30 mins
    
            //   is_expired = expiry_date < new Date()
            // }
    
            // if (is_expired) {
            //   setState('getting_signed_url')
            // }
            // else {
            //   setState('ready')
            // }
            const presigned_url_info = presigned_urls[id]
  
            if (presigned_url_info) {
              const exp = isoToDate(presigned_url_info.expiration)
              if (new Date() < exp) {
                // Urls has not expired
                // Check if amount of time lieft for link is greated than threhsold
                if (create_date(0, 0, 0, 0, 0, PRESIGNED_URL_LOW_TIME_THREHSOLD) <= exp) {
                  // Here means theres enough time left on urls
                  // However, now we check if key and content types match
                  // If they don't create new link then
                  if (presigned_url_info.key !== file_key) {
                    setState('getting_signed_url')
                    return
                  }
  
                  // If file, check content type
                  if (file) {
                    if (presigned_url_info.content_type !== file.type) {
                      setState('getting_signed_url')
                      return
                    }
                    else {
                      setState('ready')
                      return
                    }
                  }
                  else {
                    setState('ready')
                    return
                  }
                }
                else {
                  setState('getting_signed_url')
                  return
                }
              }
              else {
                // Url expired, so get new one
                setState('getting_signed_url')
                return
              }
            }
            else {
              setState('getting_signed_url')
              return
            }
          }
          else {
            // Nothing in hashmap so we getch signed_url
            setState('getting_signed_url')
            return
          }
        }
      }
  
  
      else if (state === 'getting_signed_url') {
        
        if (!file_key) {
          setState('waiting_for_key')
          return
        }
        const res = await operation_fetch('getPresignedURL', {data: {
          folder: file_folder,
          content_type: content_type,
          file_name: file_key,
          fra_account_id: fra_account_id || '',
        }})

        // On error, just revert to setting up state and retry once we change to this state again

        if (res.fetch_errors) {
          console.log(res.fetch_errors)
          setState('setting_up')
          return
        }
        else if (res.output.errors) {
          res.output.errors.map(err => {
            console.log(err)
          })
    
          setState('setting_up')
          return
        }
        else if (!res.output.presigned_url_info) {
          console.log('There was an error getting presigned url info from server')
          setState('setting_up')
          return
        }
        else {
          addSignedURL(id, res.output.presigned_url_info as PresignedURLInfo)
          setState('ready')
          return
        }
      }

      else if (state === 'waiting_for_key') {
        if (file_key) {
          setState('setting_up')
        }
      }
    })().catch(console.log)
  }, [state])


  useEffect(() => { 
    (async () => {
      if (file && state === 'ready') {
        setState('uploading')

        if (uploads === 0) {
          info('Uploading File!', '', 'SHORT')
        }
        else {
          info('Reuploading File!', '', 'SHORT')
        }
        if (presigned_urls[id]) {
          // Check if content types are equal

          const presigned_url_info = presigned_urls[id]

          // Check state of presigend url
          if (presigned_url_info) {
            const exp = isoToDate(presigned_url_info.expiration)

            if (new Date() < exp) {
              // Urls has not expired
              // Check if amount of time lieft for link is greated than threhsold
              if (create_date(0, 0, 0, 0, 0, PRESIGNED_URL_LOW_TIME_THREHSOLD) <= exp) {
                // Here means theres enough time left on urls
                // However, now we check if key and content types match
                // If they don't create new link then
                if (presigned_url_info.key !== `${file_folder as string}/${file_key ?? ''}`) {
                  err('File Upload Failed!', 'There was a problem with the upload configuration. Please, try again.')
                  setState('getting_signed_url')
                  setFile(undefined)
                }
                // If file, check content type
                else if (presigned_url_info.content_type !== file.type) {
                  err('File Upload Failed!', 'There was a problem with the upload configuration. Please, try again.')
                  setState('getting_signed_url')
                  setFile(undefined)
                }
                else {
                  try {
                    // Unless you setup DO Spaces to allow localhost requests
                    // You'll get CORS policy issue when attempting to upload a file here
                    // You can add a CORS configuration in a DO Spaces' settings tab
                    // The recommended config is:
                    /**
                     * Origin: *
                     * Allowed Methods: * except DELETE
                     * Allowed Headers: *
                     * 
                     */

                    // const xhr = new XMLHttpRequest()
                    // xhr.open('PUT', presigned_url_info.presigned_url)
                    // xhr.setRequestHeader('Content-Type', file.type)
                    // xhr.setRequestHeader('x-amz-acl', 'public-read')

                    // xhr.onload = () => {
                    //   if(xhr.status===200) {
                    //     const res = JSON.parse(xhr.response as string)
                    //     console.log(res)
                    //     ok('File Uploaded!')
                    //     setState('ready')
                    //     setFile(undefined)
                    //   }
                    // }
                    // xhr.onerror = (e) => {
                    //   console.log(e)
                    //   err('File Upload Failed!', 'Could not upload file. Please, try again.')
                    //   setState('ready')
                    //   setFile(undefined)
                    // }

                    // xhr.send(file)

                    const checksum = await getFileHashBrowser(file)

                    if (!checksum) {
                      err('File Upload Failed!', 'Could not upload file. Please, try again.')
                      setState('ready')
                      setFile(undefined)
                    }
                    else {
                      // x-amz-meta-VAR: '' is the same as params = {Metadata: {VAR: ''}}
                      const res = await fetch(presigned_url_info.presigned_url, {
                        body: file,
                        headers: {
                          // 'Access-Control-Allow-Headers' : 'Content-Type, x-amz-acl',
                          // 'Access-Control-Allow-Origin': '*',
                          // 'Access-Control-Allow-Methods': '*',
                          'Content-Type': file.type,
                          'x-amz-acl': 'public-read',
                          'x-amz-checksum-sha256': checksum,
                          'x-amz-checksum-algorithm': presigned_url_info.checksum_algorithm,
                          'x-amz-meta-checksum': checksum,
                          'x-amz-meta-checksum-algorithm': presigned_url_info.checksum_algorithm,
                        },
                        method: 'PUT'
                      })
          
                      if (res.ok) {
                        // If we receive a 200 status code, then file probably uploaded just fine
                        setUploads(uploads + 1)
                        
                        if (id && getFieldHelpers) {
                          // input.value === file_key
                          getFieldHelpers(id).setValue(`${file_folder}/${file_key!}`)
                        }
  
                        ok('File Uploaded!')
                        setState('ready')
                      }
                      else {
                        err('File Upload Failed!', 'Could not upload file. Please, try again.')
                        setState('ready')
                        setFile(undefined)
                      } 
                    }
                  }
                  catch(e) {
                    err('File Upload Failed!', 'Could not upload file. Please, try again.')
                    setState('ready')
                    setFile(undefined)
                  }
                }
              }
              else {
                // URL did not expire but too little time is left on url
                // So create a new one
                console.log('Too little time left on presigned url')
                err('File Upload Failed!', 'There was a problem with the upload configuration. Please, try again.')
                setState('getting_signed_url')
                setFile(undefined)
              }
            }
            else {
              // Url expired, so get new one
              console.log('Presigned url expired!')
              err('File Upload Failed!', 'There was a problem with the upload configuration. Please, try again.')
              setState('getting_signed_url')
              setFile(undefined)
            }
          }
          else {
            console.log('Presigned url info not set!')
            err('File Upload Failed!', 'There was a problem with the upload configuration. Please, try again.')
            setState('getting_signed_url')
            setFile(undefined)
          }
        }
        else {
          console.log('Presigned url info hashmap not set!')
          err('File Upload Failed!', 'There was a problem with the server.')
          setState('getting_signed_url')
          setFile(undefined)
        }
      }
      else {
        // Do nothing
      }
    })().catch(console.log)
  }, [file])


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (state === 'ready') {
      if (!file) {
        const fileObj = event.target.files && event.target.files[0]
        
        if (!fileObj) {
          return
        }
      
        const [type] = fileObj.type.split('/')
      
        if (fileObj.size > MAX_FILE_SIZE_BYTES) {
          err('File Size Too Large!', `Max file size upload limit is ${Math.round(MAX_FILE_SIZE_MB)}mb`)
          return
        }
      
        event.target.value = ''
        
        setFile(fileObj)
        setContentType(fileObj.type)
      }
      else {
        const fileObj = event.target.files && event.target.files[0]
        
        if (!fileObj) {
          return
        }
  
        if (file.webkitRelativePath === fileObj.webkitRelativePath) {
          // TODO: Have system to check if previous file was uplaoded
          const [type] = fileObj.type.split('/')
      
          if (fileObj.size > MAX_FILE_SIZE_BYTES) {
            err('File Size Too Large!', `Max file size upload limit is ${Math.round(MAX_FILE_SIZE_MB)}mb`)
            return
          }
        
          event.target.value = ''
          setFile(fileObj)
          setContentType(fileObj.type)
        }
        else {
          const [type] = fileObj.type.split('/')
      
          if (fileObj.size > MAX_FILE_SIZE_BYTES) {
            err('File Size Too Large!', `Max file size upload limit is ${Math.round(MAX_FILE_SIZE_MB)}mb`)
            return
          }
        
          event.target.value = ''
          setFile(fileObj)
          setContentType(fileObj.type)
        }
      } 
    }

    if (typeof onChange === 'function') {
      await onChange(event)
    }
  }

  const handleClick = () => {
    if (input_ref) {
      if (input_ref.current) {
        (input_ref.current as HTMLInputElement).click()
      }
    }
  }

  return (
    <>
      <Box mb={mb}>
        { label ?
          <FormLabel mb={st.default_spacing(0.5)} color='text' fontWeight={700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
          null
        }
        
        {/* <Input accept='' errorBorderColor='crimson' type='file' autoFocus={tabIndex === 1} {...input} alt={label} placeholder={ph_text} name={name} onChange={void handleFileChange} id={name} {...props}> */}
        {/* <Input variant={'outline'} onFocus={() => toggleCheckError(true)} onBlur={() => toggleCheckError(false)} errorBorderColor='crimson' type='file' autoFocus={tabIndex === 1} alt={label} name={id} onChange={wrapAsync(handleFileChange)} id={id} {...rest} disabled={state !== 'ready'} tabIndex={tabIndex}> */}
        {/* <Btn variant='main-color-mode' borderRadius={'2vw'} onClick={() => {}} type={'button'} cursor={!isSubmitting || state !== 'ready' ? 'pointer' : 'not-allowed'}>{text_to_show()}</Btn> */}
        {/* </Input> */}
        
        {/* <Input _focusVisible={{borderColor: border_color}} _hover={{borderColor: border_color}} borderColor={border_color_l} errorBorderColor='crimson' borderRadius='5vw' type='file' bg={bg} color={text_color} _placeholder={{color: ph}} autoFocus={tabIndex === 1} {...input} alt={label} disabled={isSubmitting || state !== 'ready'} tabIndex={tabIndex} placeholder={'Upload'} {...rest} onBlur={() => toggleCheckError(false)} onFocus={() => toggleCheckError(true)}/> */}
        

        {/* <Input id={id} ref={input_ref} display={'none'} accept=".jpg,.png,.pdf,.doc,.jpeg" disabled={isSubmitting || state !== 'ready'} _focusVisible={{borderColor: border_color}} _hover={{borderColor: border_color, cursor: 'pointer'}} borderColor={border_color_l} errorBorderColor='crimson' type='file' bg={bg} color={text_color} _placeholder={{color: ph}} autoFocus={tabIndex === 1} {...input} alt={label} tabIndex={tabIndex} {...rest}/> */}
        <Input
          id={`file_field_${id}`}
          ref={input_ref}
          display={'none'}
          accept=".jpg,.png,.pdf,.doc,.jpeg"
          disabled={isSubmitting || state !== 'ready'}
          type='file'
          autoFocus={tabIndex === 1}
          alt={label}
          tabIndex={tabIndex}
          {...rest}
          onChange={wrapAsync(handleFileChange)}
        />
        
        <Box display={'flex'} flexDirection='row'>
          <Btn tabIndex={tabIndex} pad={rv('1vw 1vw', '1vw 1vw')} mr={st.default_spacing(0.25)} disabled={isSubmitting || state !== 'ready'} variant='main-color-mode' borderRadius={'2vw'} onClick={handleClick} type={'button'}>{text_to_show()}</Btn>
          { uploads > 0 && state === 'ready' && file &&
            <IoCheckmarkOutline size={32} color='green'></IoCheckmarkOutline>
          }
        </Box>
        

        { hasError() ?
          <Box role='alert' {...eprops}>
            <ResponsiveText variant='smaller' ml={rv('4vw', '1vw')} mt={rv('2vw', '0.25vw')} color='crimson'>
              {
                Array.isArray(values[id]) && input_pos && errors[id] ?
                  (
                    values[input_pos] && (errors[id] as string[])[input_pos] ?
                      (errors[id] as string[])[input_pos] :
                      ''
                  ) :
                  (
                    values[id] && errors[id] ?
                      Array.isArray(errors[id]) ? 
                        (errors[id] as string[]).join('; ') : 
                        (errors[id] as string) ? 
                          (errors[id] as string)  :
                          '' :
                      ''
                  )
              }
            </ResponsiveText>
          </Box> :
          null
        }
      </Box>
    </>
  )
}


export const FormikFileUpdateInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})