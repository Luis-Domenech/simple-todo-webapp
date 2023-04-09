import React from 'react'
import { FormControl, chakra, Box, FormLabel, Select, InputGroup, SelectProps, BoxProps, Flex } from '@chakra-ui/react'
import { ResponsiveText } from '../ResponsiveText'
import { REGEX } from '../../constants'
import { rv } from '../../utils'
import { BaseFormikForm } from '../../types'
import { st } from '../../styles/style-config'


interface FormikSelectInputProps {
  className?: string
  id: string
  label?: string | undefined
  default_text?: string

  data?: string[] | JSX.Element[] | JSX.Element
  
  tabIndex: number

  valuesAsUpperSnakeCase?: boolean

  eprops?: BoxProps

  input_pos?: number
  
  /**
  * Formik handler onChange event is still fired. Afterwards, this would be called
  */
  onChange?: {
    (e: React.ChangeEvent<HTMLSelectElement>): (void) | (Promise<void>);
    <T = string | React.ChangeEvent<HTMLSelectElement>>(field: T): T extends React.ChangeEvent<HTMLSelectElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLSelectElement>) => (void) | (Promise<void>);
  }

  formik: BaseFormikForm

  mode?: 'view-only-horizontal' | 'regular' | 'horizontal' | 'view-only'
}

const Base: React.FC<FormikSelectInputProps & SelectProps> = (props) => {
  const { 
    mb = st.default_spacing(1),
    formik,
    onChange = undefined,
    default_text = 'Select',
    data = [],
    valuesAsUpperSnakeCase = false,
    className,
    eprops = {},
    id,
    label = undefined,
    input_pos = undefined,
    tabIndex,
    w,
    mode = 'regular',
    ...rest
  } = props
  

  // Hooks
  // const { errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur } = useFormikContext<any>()
  const { values, errors, touched, isSubmitting, getFieldProps, handleChange, handleBlur } = formik



  const handleValueChange = async (event: React.ChangeEvent<HTMLSelectElement> | undefined) => {
    handleChange(event)

    if (typeof onChange === 'function') {
      // // eslint-disable-next-line @typescript-eslint/await-thenable
      await onChange(event)
    }
  }

  return (
    <Box mb={mb}>
      { mode === 'view-only' ?
        <FormControl alignItems='center'>
          { label ?
            <FormLabel color='text' fontWeight={700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
            null
          }
          <InputGroup size='sm'>
            <>
              <Select
                autoFocus={tabIndex === 1} 
                // disabled={isSubmitting || !formik.prev_fields_valid!(id)} 
                id={id} 
                alt={label ?? 'select field'} 
                tabIndex={tabIndex} 
                {...rest}
                _hover={{cursor: 'default'}}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => e.preventDefault()}
                onBlur={(e) => e.preventDefault()} 
                color={getFieldProps(id).value ? getFieldProps(id).value !== 'DEFAULT' ? 'field_text' : 'ph' : 'ph'}
                _focusVisible={{}}
                isReadOnly={true}
                isDisabled={true}
                value={values[id] ? values[id] : 'DEFAULT'}
                borderColor='read_only_border'
                borderRadius='5vw' 
                bg='transparent'
                _placeholder={{color: 'ph'}}
              >
                <option value='DEFAULT' disabled>{default_text}</option>
                <>
                  {
                    Array.isArray(data) ? 
                      data.map(d => {
                        if (typeof d === 'string') {
                          return (<option key={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d} value={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d}>{d}</option>)
                        }
                        else {
                          if (d.props.value === formik.values[id]) return d
                          else return React.cloneElement(d, { disabled: true })
                        }
                      }) :
                      (data.props.value === formik.values[id] ? data : React.cloneElement(data, { disabled: true }))
                  }
                </>
              </Select>
            </>
          </InputGroup>
        </FormControl> :
        null
      }
      { mode === 'regular' ?
        <FormControl alignItems='center'>
          { label ?
            <FormLabel color='text' fontWeight={700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
            null
          }
          <InputGroup size='sm'>
            <>
              <Select
                autoFocus={tabIndex === 1} 
                disabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)} 
                id={id} 
                alt={label ?? 'select field'} 
                tabIndex={tabIndex} 
                {...rest}
                value={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : 'DEFAULT') : 'DEFAULT') : (values[id] ? values[id] : 'DEFAULT')}
                onChange={handleValueChange}
                onBlur={handleBlur}
                // className={className}
                color={getFieldProps(id).value ? getFieldProps(id).value !== 'DEFAULT' ? 'field_text' : 'ph' : 'ph'}
                _focusVisible={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}} 
                _hover={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}} 
                borderColor={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'light_border' : 'disabled_border') : 'light_border'} 
                borderRadius='5vw' 
                bg='transparent'
                _placeholder={{color: 'ph'}}
              >
                <option value='DEFAULT' disabled>{default_text}</option>
                <>
                  {
                    Array.isArray(data) ? 
                      data.map(d => {
                        if (typeof d === 'string') {
                          return (<option key={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d} value={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d}>{d}</option>)
                        }
                        else {
                          return d
                        }
                      }) :
                      data
                  }
                </>
              </Select>
            </>
          </InputGroup>
          {/* { hasError() ?
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
          } */}
        </FormControl> :
        null
      }
      { mode === 'horizontal' ?
        <>
          <Flex flexDir='row' w={w ?? '100%'} justifyContent={label ? 'flex-end' : 'flex-start'}>
            { label ?
              <Flex mr={rv('2vw', '1vw')} justifyContent='center' alignItems='center' >
                <ResponsiveText variant='smaller' textAlign={'right'} fontWeight={700} userSelect='none'>{label}</ResponsiveText>
              </Flex> :
              null
            }
            <Flex w={w ?? rv('60%', '40%')} justifyContent='center' alignItems='center'>
              <FormControl>
                <InputGroup size='sm'>
                  <Select 
                    id={id}
                    alt={label ?? 'select field'} 
                    autoFocus={tabIndex === 1} 
                    disabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)} 
                    tabIndex={tabIndex} 
                    {...rest}
                    height={rv('10vw', '3vw')}
                    value={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : 'DEFAULT') : 'DEFAULT') : (values[id] ? values[id] : 'DEFAULT')}
                    onChange={handleValueChange}
                    onBlur={handleBlur}
                    type='text'
                    color={getFieldProps(id).value ? getFieldProps(id).value !== 'DEFAULT' ? 'field_text' : 'ph' : 'ph'}
                    _focusVisible={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}} 
                    _hover={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}} 
                    borderColor={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'light_border' : 'disabled_border') : 'light_border'} 
                    borderRadius='0.5vw' 
                    bg='transparent'
                    _placeholder={{color: 'ph'}} 
                  >
                    <option value='DEFAULT' disabled>{default_text}</option>
                    <>
                      {
                        Array.isArray(data) ? 
                          data.map(d => {
                            if (typeof d === 'string') {
                              return (<option key={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d} value={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d}>{d}</option>)
                            }
                            else {
                              return d
                            }
                          }) :
                          data
                      }
                    </>
                  </Select>
                </InputGroup>
              </FormControl>
            </Flex>
          </Flex>
          {/* { hasError() ?
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
          } */}
        </> :
        null
      }
      { mode === 'view-only-horizontal' ?
        <>
          <Flex flexDir='row' w={w ?? '100%'} justifyContent={label ? 'flex-end' : 'flex-start'}>
            { label ?
              <Flex mr={rv('2vw', '1vw')} justifyContent='center' alignItems='center' >
                <ResponsiveText variant='smaller' textAlign={'right'} fontWeight={700} userSelect='none'>{label}</ResponsiveText>
              </Flex> :
              null
            }
            <Flex w={w ?? rv('60%', '40%')} justifyContent='center' alignItems='center'>
              <FormControl>
                <InputGroup size='sm'>
                  <Select 
                    id={id}
                    alt={label ?? 'select field'} 
                    autoFocus={tabIndex === 1} 
                    disabled={isSubmitting} 
                    tabIndex={tabIndex} 
                    {...rest}
                    height={rv('10vw', '3vw')}
                    _hover={{cursor: 'default'}}
                    onClick={(e) => e.preventDefault()}
                    onChange={(e) => e.preventDefault()}
                    onBlur={(e) => e.preventDefault()} 
                    color={getFieldProps(id).value ? getFieldProps(id).value !== 'DEFAULT' ? 'field_text' : 'ph' : 'ph'}
                    _focusVisible={{}}
                    isReadOnly={true}
                    isDisabled={true}
                    value={values[id] ? values[id] : 'DEFAULT'}
                    borderColor='read_only_border'
                    borderRadius='0.5vw' 
                    bg='transparent'
                    _placeholder={{color: 'ph'}} 
                  >
                    <option value='DEFAULT' disabled>{default_text}</option>
                    <>
                      {
                        Array.isArray(data) ? 
                          data.map(d => {
                            if (typeof d === 'string') {
                              return (<option key={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d} value={valuesAsUpperSnakeCase ? d.replace(REGEX.match_whitespace, '_').toUpperCase() : d}>{d}</option>)
                            }
                            else {
                              return d
                            }
                          }) :
                          data
                      }
                    </>
                  </Select>
                </InputGroup>
              </FormControl>
            </Flex>
          </Flex>
        </> :
        null
      }
    </Box>
  )
}


export const FormikSelectInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})