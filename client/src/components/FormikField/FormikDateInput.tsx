import React from 'react'
import { FormControl, chakra, Box, FormLabel, InputGroup, InputProps, BoxProps, Flex, Input } from '@chakra-ui/react'
// import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import InputMask from 'react-input-mask'

import { ResponsiveText } from '../ResponsiveText'
import { formatted_date, create_date } from '../../utils'
import { rv } from '../../utils'
import { st } from '../../styles/style-config'
import { BaseFormikForm } from '../../types'

const FormikDateInputDate = {
  'today': 'today',
  '-18': '-18',
  '+18': '+18',
  '+40': '+40',
  '1940': '1940',
  'fra': 'fra'
} as const
type FormikDateInputDate = typeof FormikDateInputDate[keyof typeof FormikDateInputDate]

interface FormikDateInputProps {
  className?: string
  id: string
  label?: string | undefined
  ph_text?: string | undefined  

  minDate?: FormikDateInputDate | Date
  maxDate?: FormikDateInputDate | Date
  
  tabIndex: number
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
  
  mode?: 'view-only-horizontal' | 'regular' | 'horizontal'
}

const today = formatted_date(new Date(), 'mm-dd-yyyy')
const fra = formatted_date(new Date(2008, 0, 15), 'mm-dd-yyyy')
const eighteen_years_ago = formatted_date(create_date(0, 0, -18), 'mm-dd-yyyy')
const eighteen_years_after = formatted_date(create_date(0, 0, 18), 'mm-dd-yyyy')
const fourty_years_after = formatted_date(create_date(0, 0, 40), 'mm-dd-yyyy')
const nineteen_fourty = '01-01-1940'

const getDateConstraint = (d: FormikDateInputDate | Date) => {
  let ret = ''
  
  if (typeof d === 'string') {
    if (d === 'today') ret = today
    else if (d === '-18') ret =  eighteen_years_ago
    else if (d === '+18') ret =  eighteen_years_after
    else if (d === '+40') ret =  fourty_years_after
    else if (d === '1940') ret =  nineteen_fourty
    else if (d === 'fra') ret =  fra
  }
  else if (typeof d === 'object') {
    ret = formatted_date(d, 'mm-dd-yyyy')
  }

  return ret
}

const Base: React.FC<FormikDateInputProps & InputProps> = (props) => {
  const { 
    formik,
    onChange = undefined,
    className,
    minDate = '1940',
    maxDate = '+40',
    eprops = {},
    ph_text = 'mm/dd/yyyy',
    id,
    input_pos = undefined,
    label = undefined,
    tabIndex,
    mb = st.default_spacing(1),
    w,
    mode = 'regular',
    ...rest
  } = props
  

  // State
  // const [date, setDate] = useState<Date>()

  // Hooks
  // const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur } = useFormikContext<any>()
  const { values, errors, touched, isSubmitting, getFieldProps, handleChange, handleBlur } = formik
  
  // Colors
  // const min_date = getDateConstraint(minDate)
  // const max_date = getDateConstraint(maxDate)

  // const min = date_from_string(min_date, 'start')
  // const max = date_from_string(max_date, 'start')


  const error = errors[id]
  const hasError = () => {
    try {
      if (error) {
        if (typeof error === 'string') {
          if (error === 'Required') return false
          return error.length > 0 && touched[id] && getFieldProps(id).value
        }
        else if (Array.isArray(error)) return error.length > 0 && touched[id] && getFieldProps(id).value
      }
    }
    catch {
      return false
    }
    return false
  }

  // const handleValueChange = async (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
  //   handleChange(event)

  //   if (typeof onChange === 'function') {
  //     // eslint-disable-next-line @typescript-eslint/await-thenable
  //     await onChange(event)
  //   }
  // }

  // const handleDateChange = async (date: string) => {
  //   const event = {
  //     target: {
  //       id: id,
  //       value: date
  //     }
  //   }

  //   getFieldHelpers(id).setValue(date)
      
  //   if (typeof onChange === 'function') {
  //     // eslint-disable-next-line @typescript-eslint/await-thenable
  //     await onChange(event)
  //   }
  // }

  // const handleDateChange = async (new_date: Date | undefined) => {
  //   const new_val = new_date ? formatted_date(new_date, 'yyyy-mm-dd') : undefined
    
  //   const event = {
  //     target: {
  //       id: id,
  //       value: new_val
  //     }
  //   }

  //   getFieldHelpers(id).setValue(new_val)
  //   setDate(new_date)

  //   // handleChange(event)
      
  //   if (typeof onChange === 'function') {
  //     // eslint-disable-next-line @typescript-eslint/await-thenable
  //     await onChange(event)
  //   }
  // }


  const common_input_props: InputProps = {
    autoFocus: tabIndex === 1,
    isDisabled: isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false),
    _autofill: {
      bg: 'transparent'
    },
    id: id,
    alt: label ? label : 'date field',
    tabIndex: tabIndex,
    color: 'field_text',
    ...rest,
    // minLength: min
    // maxLength: max
    // placeholder: ph_text,
    placeholder: ph_text,
    // value: typeof values[id] === 'undefined' ? values[id] : formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? values[id] : undefined) : values[id],
    value: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : '') : '') : (values[id] ? values[id] : ''),
    onBlur: handleBlur,
    _focusVisible: {
      borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'
    },
    _hover: {
      borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'
    },
    borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'light_border' : 'disabled_border') : 'light_border',
    borderRadius: '5vw',
    bg: 'transparent',
    _placeholder: {
      color: 'ph'
    },
    // cursor: prev_fields_valid() ? 'default' : 'not-allowed'
  }

  const view_only_props: InputProps = {
    autoFocus: tabIndex === 1,
    id: id,
    alt: label ? label : 'date field',
    color: 'field_text',
    ...rest,
    tabIndex: 99,
    isReadOnly: true,
    placeholder: ph_text,
    value: values[id],
    _focusVisible: {},
    _hover: {
      cursor: 'default'
    },
    onClick: (e) => e.preventDefault(),
    onChange: (e) => e.preventDefault(),
    borderColor: 'read_only_border',
    borderRadius: '0.5vw',
    bg: 'transparent',
    _placeholder: {
      color: 'ph'
    },
    // cursor: prev_fields_valid() ? 'default' : 'not-allowed'
  }

  const handleValueChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    if (event) {
      handleChange(event)

      if (typeof onChange === 'function') {
        // // eslint-disable-next-line @typescript-eslint/await-thenable
        await onChange(event)
      }
    }
  }

  return (
    <Box mb={mb}>
      { mode === 'regular' ?
        <>
          <FormControl>
            { label ?
              <FormLabel color='text' fontWeight={700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
              null
            }
            <InputGroup size='sm'>
              <>
                <Input 
                  {...common_input_props}
                  as={InputMask}
                  mask='99/99/9999'
                  // maskPlaceholder={null} // Makes the `-` dissappear from value
                  onChange={handleValueChange}
                  type='text'
                />
                {/* <SingleDatepicker 
                  disabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)} 
                  id={id}
                  date={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? date : undefined) : date}
                  onDateChange={handleDateChange}
                  configs={{
                    dateFormat: 'yyyy-MM-dd',
                    firstDayOfWeek: 0
                  }}
                  propsConfigs={{
                    inputProps: {
                      autoFocus: tabIndex === 1,
                      placeholder: ph_text,
                      alt: label ?? 'date field',
                      tabIndex: tabIndex,
                      ...rest,
                      // paddingY: rv('4.5vw', '1.25vw'),
                      onBlur: handleBlur,
                      color: values[id] ? field_value_color : ph,
                      _focusVisible: {borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color : disabled_border_color) : border_color},
                      _hover: {borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color : disabled_border_color) : border_color},
                      borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color_l : disabled_border_color) : border_color_l,
                      borderRadius: '5vw',
                      bg: bg,
                      _placeholder: {color: ph}
                    },
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        bg: bg,
                        color: text_color,
                        _hover: {
                          bg: border_color_l
                        }
                      },
                      selectedBtnProps: {
                        bg: border_color,
                        color: text_color,
                      },
                      todayBtnProps: {
                        borderColor: border_color_l,
                      }
                    },
                  }}
                  minDate={min} 
                  maxDate={max}
                /> */}
              </>
            </InputGroup>
            { hasError() ?
              <Box role='alert' ml={rv('4vw', '1vw')} mt={rv('0vw', '0.25vw')} {...eprops}>
                <ResponsiveText variant='smaller'  color='crimson'>
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
          </FormControl>
        </> :
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
                  <Input 
                    {...common_input_props}
                    as={InputMask}
                    mask='99/99/9999'
                    // maskPlaceholder={null} // Makes the `-` dissappear from value
                    onChange={handleValueChange}
                    type='text'
                    // maskPlaceholder={null}
                    borderRadius='0.5vw'
                    paddingY={rv('5vw', '1.3vw')}
                  />
                  {/* <SingleDatepicker 
                    disabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)} 
                    id={id}
                    date={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? date : undefined) : date}
                    // date={date}
                    onDateChange={handleDateChange}
                    configs={{
                      dateFormat: 'yyyy-MM-dd',
                      firstDayOfWeek: 0,
                    }}
                    propsConfigs={{
                      inputProps: {
                        // isDisabled: isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false),
                        autoFocus: tabIndex === 1,
                        placeholder: ph_text,
                        alt: label ?? 'date field',
                        tabIndex: tabIndex,
                        ...rest,
                        paddingY: rv('4.5vw', '1.25vw'),
                        onBlur: handleBlur,
                        color: values[id] ? field_value_color : ph,
                        _focusVisible: {borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color : disabled_border_color) : border_color},
                        _hover: {borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color : disabled_border_color) : border_color},
                        borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? border_color_l : disabled_border_color) : border_color_l,
                        borderRadius: '0.5vw',
                        bg: bg,
                        _placeholder: {color: ph},
                        zIndex: 20,
                      },
                      dayOfMonthBtnProps: {
                        defaultBtnProps: {
                          zIndex: 20,
                          bg: bgColor,
                          color: text_color,
                          _hover: {
                            bg: border_color_l
                          }
                        },
                        selectedBtnProps: {
                          bg: border_color,
                          color: text_color,
                        },
                        todayBtnProps: {
                          borderColor: border_color_l,
                        }
                      },
                      popoverCompProps: {
                        popoverContentProps: {
                          bg: bgColor,
                          opacity: 1,
                          zIndex: 20
                        },
                        popoverBodyProps: {
                          bg: bgColor,
                          opacity: 1,
                          zIndex: 20
                        }
                      }
                    }}
                    minDate={min} 
                    maxDate={max}
                  /> */}
                </InputGroup>
              </FormControl>
            </Flex>
          </Flex>

          { hasError() ?
            <Box role='alert' w={w ?? rv('60%', '40%')} ml={'auto'} mb={st.default_spacing(1)} {...eprops}>
              <ResponsiveText variant='smaller' color='crimson'>
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
                  <Input 
                    {...view_only_props}
                    as={InputMask}
                    mask='99/99/9999'
                    // maskPlaceholder={null} // Makes the `-` dissappear from value
                    type='text' 
                  />
                  {/* <SingleDatepicker 
                    disabled={isSubmitting} 
                    id={id}
                    date={date}
                    onDateChange={handleDateChange}
                    configs={{
                      dateFormat: 'yyyy-MM-dd',
                      firstDayOfWeek: 0
                    }}
                    propsConfigs={{
                      inputProps: {
                        autoFocus: tabIndex === 1,
                        placeholder: ph_text,
                        alt: label ?? 'date field',
                        tabIndex: tabIndex,
                        _hover: {cursor: 'default'},
                        ...rest,
                        paddingY: rv('4.5vw', '1.25vw'),
                        color: values[id] ? field_value_color : ph,
                        _focusVisible: {},
                        borderColor: read_only_border,
                        errorBorderColor: 'crimson',
                        borderRadius: '0.5vw',
                        bg: bg,
                        _placeholder: {color: ph},
                        onClick: (e) => e.preventDefault(),
                        onChange: (e) => e.preventDefault(),
                        onBlur: (e) => e.preventDefault(),
                        isReadOnly: true,

                      },
                      dayOfMonthBtnProps: {
                        defaultBtnProps: {
                          bg: bg,
                          color: text_color,
                          _hover: {
                            bg: border_color_l
                          }
                        },
                        selectedBtnProps: {
                          bg: border_color,
                          color: text_color,
                        },
                        todayBtnProps: {
                          borderColor: border_color_l,
                        }
                      },
                    }}
                    minDate={min} 
                    maxDate={max}
                  /> */}
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


export const FormikDateInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})