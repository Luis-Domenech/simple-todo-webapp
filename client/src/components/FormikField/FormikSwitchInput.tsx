import React from 'react'
import { FormControl, chakra, Box, FormLabel, Switch, InputGroup, SwitchProps, BoxProps } from '@chakra-ui/react'
import { BaseFormikForm } from '../../types'
import { st } from '../../styles/style-config'


interface FormikSwitchInputProps {
  className?: string
  id: string
  label?: string | undefined
  
  text_alignment?: 'left' | 'right'
  text_style?: 'regular' | 'bold'

  tabIndex: number

  eprops?: BoxProps

  /**
  * Formik handler onChange event is still fired. Afterwards, this would be called
  */
  onChange?: {
    (e: React.ChangeEvent<HTMLInputElement>): (void) | (Promise<void>);
    <T = string | React.ChangeEvent<HTMLInputElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLInputElement>) => (void) | (Promise<void>);
  }

  formik: BaseFormikForm
}

const Base: React.FC<FormikSwitchInputProps & SwitchProps> = (props) => {
  const { 
    formik,
    onChange = undefined,
    text_alignment = 'left',
    text_style = 'bold',
    className,
    eprops = {},
    id,
    label = undefined,
    tabIndex, 
    mb = st.default_spacing(1),
    ...rest 
  } = props
  

  // Hooks
  // const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur } = useFormikContext<any>()
  const { values, isSubmitting, handleChange, handleBlur } = formik
  
  const handleValueChange = async (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    handleChange(event)

    if (typeof onChange === 'function') {
      // // eslint-disable-next-line @typescript-eslint/await-thenable
      await onChange(event)
    }
  }

  return (
    <Box mb={mb}>
      <FormControl display='flex' alignItems='center'>
        { label && text_alignment === 'left' ?
          <FormLabel color='text' fontWeight={text_style === 'regular' ? 300 : 700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
          null
        }
        <InputGroup size='sm'>
          <>
            <Switch 
              className={className}
              autoFocus={tabIndex === 1} 
              disabled={isSubmitting} 
              id={id} 
              alt={label ?? 'switch field'} 
              tabIndex={tabIndex} 
              {...rest}
              value={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : false) : false) : (values[id] ? values[id] : false)}
              onChange={handleValueChange}
              onBlur={handleBlur}
              color='text'
              _focusVisible={{borderColor: 'border'}} 
              _hover={{borderColor: 'border'}} 
              borderColor='light_border' 
              borderRadius='5vw' 
              bg='transparent'
              _placeholder={{color: 'ph'}} 
            />
          </>
        </InputGroup>
        { label && text_alignment === 'right' ?
          <FormLabel color='text' fontWeight={text_style === 'regular' ? 300 : 700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
          null
        }
      </FormControl>
    </Box>
  )
}


export const FormikSwitchInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})