import React from 'react'
import { chakra, Box, BoxProps } from '@chakra-ui/react'
import { Btn } from '../Btn'
import { BaseFormikForm, ResponsiveVal } from '../../types'
import { ResponsiveText, ResponsiveTextVariants } from '../ResponsiveText'
import { rv } from '../../utils'

interface FormikClearBtnProps {
  className?: string
  text?: string

  tabIndex: number
  formik:  BaseFormikForm
  pad?: ResponsiveVal<string>
  textVariant?: ResponsiveTextVariants
}

const Base: React.FC<FormikClearBtnProps & BoxProps> = (props) => {
  const { 
    formik,
    text = 'Clear',
    className,
    tabIndex,
    pad = rv('1.5vw 1.5vw', '1.5vw 1.5vw'),
    textVariant = 'p',
    ...rest
  } = props
  

  // Hooks
  // const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur, isValid } = useFormikContext<any>()
  const { isSubmitting, values, setFieldValue, form_schema, resetForm, getFieldHelpers, setFormikState } = formik


  const handleClick = () => {
    // setFormikState({
    //   errors: {},
    //   isSubmitting: false,
    //   isValidating: false,
    //   submitCount: 0,
    //   touched: {},
    //   values: {},
    // })
    resetForm({values: ''})

    // if (form_schema) {
    //   Object.keys(form_schema.shape as Record<string, any>).map(id => {
    //     // if (typeof values[id] !== 'undefined') setFieldValue(id, '')
    //     // else setFieldValue(id, undefined)

    //     if (typeof values[id] !== 'undefined') getFieldHelpers(id).setValue('')
    //     else getFieldHelpers(id).setValue(undefined)

    //     setFormikState({
    //       errors: {},
    //       isSubmitting: false,
    //       isValidating: false,
    //       submitCount: 0,
    //       touched: {},
    //       values: {},
    //     })

    //   })
    // }
    // else {
    //   resetForm()
    // }
  }

  return (
    <Box {...rest} display={'flex'} justifyContent='center'>
      <Btn
        pad={pad}
        variant='main-color-mode'
        tabIndex={tabIndex}
        borderRadius={'2vw'}
        type={!isSubmitting ? 'submit' : 'button'}
        cursor={!isSubmitting ? 'pointer' : 'not-allowed'}
        onClick={handleClick}
      >
        <ResponsiveText color='white' variant={textVariant}>{text}</ResponsiveText>
      </Btn>
    </Box>
  )
}


export const FormikClearBtn = chakra(Base, {
  shouldForwardProp: (prop) => true
})