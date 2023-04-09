import React, { useState } from 'react'
import { FormControl, Textarea, chakra, Box, FormLabel, Input, InputGroup, InputProps, InputRightElement, Button, BoxProps, TextareaProps, Flex } from '@chakra-ui/react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import InputMask from 'react-input-mask'
import { ResponsiveText } from '../ResponsiveText'
import { rv, currencyToNumber } from '../../utils'
import { NumericFormat } from 'react-number-format'
import { BaseFormikForm } from '../../types'
import { st } from '../../styles/style-config'


type FormikInputProps = {
  className?: string
  id: string
  label?: string | undefined
  ph_text?: string | undefined  
  field_type?: 'multiline' | 'text' | 'password' | 'email' | 'number' | 'phone' | 'ssn' | 'currency' | 'formatted_number' | 'percentage'

  tabIndex: number

  input_pos?: number
  eprops?: BoxProps

  /**
  * Formik handler onChange event is still fired. Afterwards, this would be called
  */
  onChange?: {
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): (void) | (Promise<void>);
    <T = string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => (void) | (Promise<void>);
  }
  
  // We override the FormikForm here since zod fucks getting keys of a zod object
  // an thus fieldHasErrors and fieldIsValid always throw a TS type error
  // even though the formik prop we pass always has the correct typings
  formik: BaseFormikForm
  

  tooltip?: string

  mode?: 'view-only-horizontal' | 'regular' | 'horizontal'
}

const Base = (props: FormikInputProps & InputProps & TextareaProps) => {
  const {
    formik, 
    onChange = undefined,
    className,
    input_pos,
    eprops = {},
    ph_text,
    field_type = 'text',
    id,
    label = undefined,
    tabIndex,
    tooltip = undefined,
    mode = 'regular',
    mb = st.default_spacing(1),
    w,
    ...rest
  } = props
  

  // Hooks
  // const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur } = useFormikContext<any>()
  const { values, errors, touched, isSubmitting, getFieldHelpers, getFieldProps, handleChange, handleBlur, form_schema } = formik
  
  // State Vars
  const [show, toggleShow] = useState<boolean>(false)


  const min = undefined
  const max = undefined
  // const min: number | undefined = form_schema ? form_schema.shape ? form_schema.shape[id] ? form_schema.shape[id]._def ? form_schema.shape[id]._def.checks ? form_schema.shape[id]._def.checks.find(({kind}: any) => kind === 'min').value : undefined : undefined : undefined : undefined : undefined
  // const max: number | undefined = form_schema ? form_schema.shape ? form_schema.shape[id] ? form_schema.shape[id]._def ? form_schema.shape[id]._def.checks ? form_schema.shape[id]._def.checks.find(({kind}: any) => kind === 'max').value : undefined : undefined : undefined : undefined : undefined

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

  const handleValueChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    handleChange(event)

    if (typeof onChange === 'function') {
      // // eslint-disable-next-line @typescript-eslint/await-thenable
      await onChange(event)
    }
  }
  
  const handleInputMaskChange = async (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (typeof onChange === 'function' && event) {
      try {
        // // eslint-disable-next-line @typescript-eslint/await-thenable
        await onChange({
          ...event,
          target: {
            ...event.target,
            id: id,
            value: currencyToNumber(event.target.value)
          }
        })
      }
      catch {
        // do nothing
        await onChange(event)
      }
    }
  }

  const alt_text = () => {
    if (label) return label
    else if (field_type === 'currency') return 'currency field'
    else if (field_type === 'email') return 'email field'
    else if (field_type === 'formatted_number') return 'number field'
    else if (field_type === 'multiline') return 'text box field'
    else if (field_type === 'number') return 'number field'
    else if (field_type === 'password') return 'password field'
    else if (field_type === 'percentage') return 'percentage field'
    else if (field_type === 'phone') return 'phone field'
    else if (field_type === 'ssn') return 'social security number field'
    else if (field_type === 'text') return 'text field'
    return 'input field'
  }

  // const input_type = (): HTMLInputTypeAttribute | undefined => {
  //   if (field_type === 'currency') return 'number'
  //   else if (field_type === 'email') return 'email'
  //   else if (field_type === 'formatted_number') return undefined
  //   else if (field_type === 'multiline') return undefined
  //   else if (field_type === 'number') return 'number'
  //   else if (field_type === 'password') return 'password'
  //   else if (field_type === 'percentage') return undefined
  //   else if (field_type === 'phone') return 'phone'
  //   else if (field_type === 'ssn') return undefined
  //   else if (field_type === 'text') return 'text'
  // }

  // useEffect(() => {
  //   console.log('A')
  //   console.log(values[id])
  // }, [values[id]])

  const common_input_props: InputProps & TextareaProps = {
    autoFocus: tabIndex === 1,
    isDisabled: isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false),
    _autofill: {
      bg: 'transparent'
    },
    id: id,
    alt: alt_text(),
    tabIndex: tabIndex,
    color: 'field_text',
    ...rest,
    // minLength: min
    // maxLength: max
    placeholder: ph_text,
    // value: typeof values[id] === 'undefined' ? values[id] : formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? values[id] : undefined) : values[id],
    value: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : '') : '') : (values[id] ? values[id] : ''),
    // value: typeof values[id] === 'undefined' ? '' : values[id],
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

  const view_only_props: InputProps & TextareaProps = {
    autoFocus: tabIndex === 1,
    id: id,
    alt: alt_text(),
    color: 'field_text',
    ...rest,
    tabIndex: 99,
    isReadOnly: true,
    placeholder: ph_text,
    value: typeof values[id] === 'undefined' ? '' : values[id],
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

  return (
    <>
      { mode === 'regular' && (
        <Box mb={mb}>
          <FormControl>
            { label ?
              <FormLabel color='text' fontWeight={700} userSelect='none' htmlFor={id}>{label}</FormLabel> :
              null
            }
            <InputGroup size='sm'>
              { field_type === 'text' && (
                <>
                  <Input 
                    // disabled={isSubmitting || !prev_fields_valid()} 
                    {...common_input_props}
                    minLength={min}
                    maxLength={max}
                    onChange={handleValueChange}
                    type='text'
                  />
                </>
              )}
              { field_type === 'email' && (
                <>
                  <Input 
                    {...common_input_props}
                    minLength={min}
                    maxLength={max}
                    onChange={handleValueChange}
                    type='email'
                  />
                </>
              )}
              { field_type === 'number' && (
                <>
                  <Input 
                    {...common_input_props}
                    min={min}
                    max={max}
                    // Makes it so that scrolling down on page does not scroll on number value too
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={handleValueChange}
                    type='number'
                  />
                </>
              )}
              { field_type === 'currency' && (
                <>
                  <Input
                    {...common_input_props}
                    onWheel={(e) => e.currentTarget.blur()}
                    as={NumericFormat}
                    prefix={'$'}
                    thousandSeparator=','
                    decimalSeparator='.'
                    decimalScale={2}
                    onChange={handleInputMaskChange}
                    onValueChange={(values: any) => {
                      const {formattedValue, value, floatValue} = values
                      getFieldHelpers(id).setValue(floatValue)
                    }}
                  />
                </>
              )}
              { field_type === 'percentage' && (
                <>
                  <Input
                    {...common_input_props}
                    onWheel={(e) => e.currentTarget.blur()}
                    as={NumericFormat}
                    suffix={'%'}
                    thousandSeparator=','
                    decimalSeparator='.'
                    decimalScale={3}
                    onChange={handleInputMaskChange}
                    onValueChange={(values: any) => {
                      const {formattedValue, value, floatValue} = values
                      getFieldHelpers(id).setValue(floatValue)
                    }}
                  />
                </>
              )}
              { field_type === 'formatted_number' && (
                <>
                  <Input 
                    {...common_input_props}
                    onWheel={(e) => e.currentTarget.blur()}
                    as={NumericFormat}
                    thousandSeparator=','
                    decimalSeparator='.'
                    onChange={handleInputMaskChange}
                    onValueChange={(values: any) => {
                      const {formattedValue, value, floatValue} = values
                      getFieldHelpers(id).setValue(floatValue)
                    }}
                  />
                </>
              )}
              { field_type === 'password' && (
                <>
                  <Input 
                    {...common_input_props}
                    minLength={min}
                    maxLength={max}
                    onChange={handleValueChange}
                    type={show ? 'text' : 'password'}
                  />
                  <InputRightElement width={rv('4.5rem', '4.5rem')}>
                    <Button h={rv('7vw', '2vw')} mr={rv('1vw', '1vw')} mt={rv('2vw', '0.55vw')} size='sm' onClick={() => toggleShow(!show)}>
                      {show ? <BsEyeSlashFill size='22' /> : <BsEyeFill size='22' />}
                    </Button>
                  </InputRightElement>
                </>
              )}
              { field_type === 'phone' && (
                <>
                  <Input 
                    {...common_input_props}
                    as={InputMask}
                    mask='999-999-9999'
                    maskPlaceholder={null} // Makes the `-` dissappear from value
                    onChange={handleValueChange}
                    type='text'
                  />
                </>
              )}
              { field_type === 'ssn' && (
                <>
                  <Input 
                    {...common_input_props}
                    as={InputMask}
                    mask='999-99-9999'
                    // maskPlaceholder={null} // Makes the `-` dissappear from value
                    onChange={handleValueChange}
                    type='text'
                  />
                </>
              )}
              { field_type === 'multiline' && (
                <>
                  <Textarea 
                    {...common_input_props} // props below override passe props props (intentionally done here)
                    rows={3}
                    minLength={min}
                    maxLength={max}
                    type='text'
                    onChange={handleValueChange}
                    resize='vertical' 
                    borderRadius={rv('0.5vw', '0.25vw')}
                    // isInvalid={!!(errors[id] && touched[id])}
                  />
                </>
              )}
            </InputGroup>
            {/* { !!(errors[id] && touched[id]) && ( */}
            { hasError() ?
              <Box role='alert' ml={rv('4vw', '1vw')} mt={rv('0vw', '0.25vw')} {...eprops}>
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
          </FormControl>
        </Box>
      )}



      { mode === 'view-only-horizontal' && (
        <Flex mb={mb} flexDir='row' w='100%' justifyContent={label ? 'flex-end' : 'flex-start'}>
          { label ?
            <Flex mr={rv('2vw', '1vw')} justifyContent='center' alignItems='center' >
              <ResponsiveText variant='smaller' textAlign={'right'} fontWeight={700} userSelect='none'>{label}</ResponsiveText>
            </Flex> :
            null
          }
          <Flex w={w ?? rv('60%', '40%')} justifyContent='center' alignItems='center'>
            <FormControl>
              <InputGroup size='sm'>
                { field_type === 'text' && (
                  <>
                    <Input 
                      {...view_only_props}
                      value={values[id]}
                      type='text' 
                      _hover={{cursor: 'default'}}
                      onClick={(e) => e.preventDefault()}
                      onChange={(e) => e.preventDefault()}
                      readOnly
                    />
                  </>
                )}
                { field_type === 'email' && (
                  <>
                    <Input 
                      {...view_only_props}
                      type='email'
                    />
                  </>
                )}
                { field_type === 'number' && (
                  <>
                    <Input 
                      {...view_only_props}
                      type='number'
                    />
                  </>
                )}
                { field_type === 'currency' && (
                  <>
                    <Input
                      {...view_only_props}
                      as={NumericFormat}
                      prefix={'$'}
                      thousandSeparator=','
                      decimalSeparator='.'
                      decimalScale={2}
                      onValueChange={() => {}}
                    />
                  </>
                )}
                { field_type === 'percentage' && (
                  <>
                    <Input
                      {...view_only_props}
                      as={NumericFormat}
                      suffix={'%'}
                      thousandSeparator=','
                      decimalSeparator='.'
                      decimalScale={3}
                      onValueChange={() => {}}
                    />
                  </>
                )}
                { field_type === 'formatted_number' && (
                  <>
                    <Input 
                      {...view_only_props} 
                      as={NumericFormat}
                      thousandSeparator=','
                      decimalSeparator='.'
                      onValueChange={() => {}}
                    />
                  </>
                )}
                { field_type === 'password' && (
                  <>
                    <Input 
                      {...view_only_props}
                      type={show ? 'text' : 'password'}
                    />
                    <InputRightElement width={rv('4.5rem', '4.5rem')}>
                      <Button h={rv('2vw', '2vw')} mr={rv('1vw', '1vw')} mt={rv('0.55vw', '0.55vw')} size='sm' onClick={() => toggleShow(!show)}>
                        {show ? <BsEyeSlashFill size='22' /> : <BsEyeFill size='22' />}
                      </Button>
                    </InputRightElement>
                  </>
                )}
                { field_type === 'phone' && (
                  <>
                    <Input 
                      {...view_only_props}
                      as={InputMask}
                      mask='999-999-9999'
                      maskPlaceholder={null} // Makes the `-` dissappear from value
                      type='text'
                    />
                  </>
                )}
                { field_type === 'ssn' && (
                  <>
                    <Input 
                      {...view_only_props}
                      as={InputMask}
                      mask='999-99-9999'
                      // maskPlaceholder={null} // Makes the `-` dissappear from value
                      type='text' 
                    />
                  </>
                )}
                { field_type === 'multiline' && (
                  <>
                    <Textarea 
                      {...view_only_props}
                      rows={3}
                      type='text' 
                      resize='vertical' 
                      // isInvalid={!!(errors[id] && touched[id])}
                    />
                  </>
                )}
              </InputGroup>
            </FormControl>
          </Flex>
        </Flex>
      )}




      { mode === 'horizontal' && (
        <>
          <Flex mb={mb} flexDir='row' w='100%' justifyContent={label ? 'flex-end' : 'flex-start'}>
            { label ?
              <Flex mr={rv('2vw', '1vw')} justifyContent='center' alignItems='center' >
                <ResponsiveText variant='smaller' textAlign={'right'} fontWeight={700} userSelect='none'>{label}</ResponsiveText>
              </Flex> :
              null
            }
            <Flex w={w ?? rv('60%', '40%')} justifyContent='center' alignItems='center'>
              <FormControl>
                <InputGroup size='sm'>
                  { field_type === 'text' && (
                    <>
                      <Input 
                        {...common_input_props}
                        minLength={min}
                        maxLength={max}
                        onChange={handleValueChange}
                        type='text'
                        borderRadius='0.5vw'
                      />
                    </>
                  )}
                  { field_type === 'email' && (
                    <>
                      <Input 
                        {...common_input_props}
                        minLength={min}
                        maxLength={max}
                        onChange={handleValueChange}
                        type='email'
                        borderRadius='0.5vw'
                      />
                    </>
                  )}
                  { field_type === 'number' && (
                    <>
                      <Input 
                        {...common_input_props}
                        min={min}
                        max={max}
                        onChange={handleValueChange}
                        onWheel={(e) => e.currentTarget.blur()}
                        type='number'
                        borderRadius='0.5vw'
                      />
                    </>
                  )}
                  { field_type === 'currency' && (
                    <>
                      <Input
                        {...common_input_props}
                        onWheel={(e) => e.currentTarget.blur()}
                        as={NumericFormat}
                        prefix={'$'}
                        thousandSeparator=','
                        decimalSeparator='.'
                        decimalScale={2}
                        onChange={handleInputMaskChange}
                        onValueChange={(values: any) => {
                          const {formattedValue, value, floatValue} = values
                          getFieldHelpers(id).setValue(floatValue)
                        }}
                        borderRadius='0.5vw'
                      />
                    </>
                  )}
                  { field_type === 'percentage' && (
                    <>
                      <Input
                        {...common_input_props}
                        onWheel={(e) => e.currentTarget.blur()}
                        as={NumericFormat}
                        suffix={'%'}
                        thousandSeparator=','
                        decimalSeparator='.'
                        decimalScale={3}
                        onChange={handleInputMaskChange}
                        onValueChange={(values: any) => {
                          const {formattedValue, value, floatValue} = values
                          getFieldHelpers(id).setValue(floatValue)
                        }}
                        borderRadius='0.5vw' 
                      />
                    </>
                  )}
                  { field_type === 'formatted_number' && (
                    <>
                      <Input 
                        {...common_input_props}
                        as={NumericFormat}
                        thousandSeparator=','
                        decimalSeparator='.'
                        onChange={handleInputMaskChange}
                        onValueChange={(values: any) => {
                          const {formattedValue, value, floatValue} = values
                          getFieldHelpers(id).setValue(floatValue)
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        borderRadius='0.5vw' 
                      />
                    </>
                  )}
                  { field_type === 'password' && (
                    <>
                      <Input 
                        // disabled={isSubmitting || !prev_fields_valid()} 
                        {...common_input_props}
                        minLength={min}
                        maxLength={max}
                        onChange={handleValueChange}
                        type={show ? 'text' : 'password'}
                        borderRadius='0.5vw' 
                      />
                      <InputRightElement width={rv('4.5rem', '4.5rem')}>
                        <Button h={rv('2vw', '2vw')} mr={rv('1vw', '1vw')} mt={rv('0.55vw', '0.55vw')} size='sm' onClick={() => toggleShow(!show)}>
                          {show ? <BsEyeSlashFill size='22' /> : <BsEyeFill size='22' />}
                        </Button>
                      </InputRightElement>
                    </>
                  )}
                  { field_type === 'phone' && (
                    <>
                      <Input 
                        as={InputMask}
                        mask='999-999-9999'
                        maskPlaceholder={null} // Makes the `-` dissappear from value
                        {...common_input_props}
                        onChange={handleValueChange}
                        type='text'
                        borderRadius='0.5vw' 
                      />
                    </>
                  )}
                  { field_type === 'ssn' && (
                    <>
                      <Input 
                        as={InputMask}
                        mask='999-99-9999'
                        // maskPlaceholder={null} // Makes the `-` dissappear from value
                        {...common_input_props}
                        onChange={handleValueChange}
                        type='text' 
                        borderRadius='0.5vw' 
                      />
                    </>
                  )}
                  { field_type === 'multiline' && (
                    <>
                      <Textarea 
                        {...common_input_props}
                        minLength={min}
                        maxLength={max}
                        onChange={handleValueChange}
                        type='text' 
                        borderRadius='0.5vw' 
                        resize='vertical' 
                        // isInvalid={!!(errors[id] && touched[id])}
                      />
                    </>
                  )}
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
        </>
      )}
    </>
  )
}


export const FormikInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})