import React, { useEffect, useState } from 'react'
import { chakra, Box, Spinner, BoxProps } from '@chakra-ui/react'
import { Btn } from '../Btn'
import { BaseFormikForm, ResponsiveVal } from '../../types'
import { ResponsiveText, ResponsiveTextVariants } from '../ResponsiveText'
import { rv, wrapAsync } from '../../utils'
import { useCustomToast } from '../../hooks/useCustomToast'

interface FormikSubmitBtnProps {
  className?: string
  text?: string

  tabIndex: number
  formik:  BaseFormikForm
  pad?: ResponsiveVal<string>
  textVariant?: ResponsiveTextVariants
}

const Base: React.FC<FormikSubmitBtnProps & BoxProps> = (props) => {
  const { 
    formik,
    text = 'Submit',
    className,
    tabIndex,
    pad = rv('1.5vw 1.5vw', '1.5vw 1.5vw'),
    textVariant = 'p',
    ...rest
  } = props
  

  // Hooks
  // const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur, isValid } = useFormikContext<any>()
  const { errors, touched, isSubmitting, isValid, validateForm, values, handleSubmit } = formik
  const { err } = useCustomToast()
  
  const [has_error, setError] = useState(true)

  useEffect(() => {
    (async () => {
      const err = await validateForm(values)
      setError(Array.from(Object.values(errors)).length > 0)
    })().catch(console.log)
  }, [])


  useEffect(() => {
    if (errors) {
      setError(Array.from(Object.values(errors)).length > 0)
    }
    else {
      setError(false)
    }
  }, [errors])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    if (isSubmitting || !isValid || has_error) {
      // console.log(errors)
      // console.log(values)
      err('Form Error!', 'Form has missing or invalid data. Fill in all fields correctly and try again.')
      return
    }

    const e = await formik.validateForm(values)
    // console.log(values)

    if (Array.from(Object.values(e)).length > 0) err('Form Error!', 'Form has missing or invalid data. Fill in all fields correctly and try again.')
    else handleSubmit()
  }

  // const hasErrors = async (): Promise<boolean> => {
  //   const err = await formik.validateForm(formik.values)
  //   // const touch = Array.from(Object.values(touched)).find(value => typeof value === 'boolean' && value)
  //   // const has_errors = Array.from(Object.values(errors)).length > 0
  //   const has_errors = Array.from(Object.values(err)).length > 0

  //   // Form has not been touched, so validation has not run and thus isValid is 
  //   // true although it shouldn't
  //   // if (touch) return isSubmitting || !isValid || has_errors
  //   // else return tru

  //   console.log(err)
  //   console.log(has_errors)
    
  //   return isSubmitting || !isValid || has_errors
  // }




  return (
    <Box {...rest} display={'flex'} justifyContent='center'>
      <Btn
        pad={pad}
        variant='main-color-mode'
        tabIndex={tabIndex}
        borderRadius={'2vw'}
        type={!isSubmitting && isValid && !has_error ? 'submit' : 'button'}
        cursor={!isSubmitting && isValid && !has_error ? 'pointer' : 'not-allowed'}
        onClick={wrapAsync(handleClick) as any}
      >
        { isSubmitting ? 
          <Spinner alignSelf={'center'} mt={rv('0vw', '-0.75vw')} size='md' color='white' /> : 
          <ResponsiveText alignSelf={'center'} color='white' variant={textVariant}>{text}</ResponsiveText>
        }
      </Btn>
    </Box>
  )
}


export const FormikSubmitBtn = chakra(Base, {
  shouldForwardProp: (prop) => true
})