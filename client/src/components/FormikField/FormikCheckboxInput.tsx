import React from 'react'
import { FormControl, chakra, Box, Checkbox, InputGroup, CheckboxProps, BoxProps } from '@chakra-ui/react'
import { BaseFormikForm } from '../../types'
import { st } from '../../styles/style-config'
import { ResponsiveText } from '../ResponsiveText'

interface FormikCheckboxInputProps {
  className?: any
  id: string
  label?: string | undefined
  
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

const Base: React.FC<FormikCheckboxInputProps & CheckboxProps> = (props) => {
  const {
    formik,
    onChange,
    text_style = 'bold',
    className,
    eprops = {},
    id,
    label = undefined,
    mb = st.default_spacing(1),
    tabIndex,
    ...rest
  } = props
  

  // Hooks
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
        <InputGroup size='sm'>
          <>
            <Checkbox 
              className={className}
              autoFocus={tabIndex === 1} 
              isDisabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)}
              id={id} 
              alt={label ?? 'checkbox field'} 
              tabIndex={tabIndex}
              color='text'
              {...rest}
              value={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : false) : false) : (values[id] ? values[id] : false)}
              onChange={handleValueChange}
              onBlur={handleBlur}
              // _checked={{borderColor: 'red'}}
              // sx={{'[data-checked]': {borderColor: border_color, background: 'transparent'}}}
              sx={{
                '[data-checked]': {
                  borderColor: 'brand',
                  background: 'brand',
                  color: 'white',
                  _hover: {
                    borderColor: 'brand',
                    background: 'brand',
                    color: 'white',
                  }
                }
              }}
              _focusVisible={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}}
              _hover={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}}
              // colorScheme='transparent'
              borderColor={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'light_border' : 'disabled_border') : 'light_border'}
            >
              <ResponsiveText variant='small'>{label}</ResponsiveText>
            </Checkbox>
          </>
        </InputGroup>
      </FormControl>
    </Box>
  )
}


export const FormikCheckboxInput = chakra(Base, {
  shouldForwardProp: (prop) => true
})












// import React from 'react'
// import { FormControl, chakra, Box, Checkbox, InputGroup, CheckboxProps, BoxProps } from '@chakra-ui/react'
// import { BaseFormikForm, FormikForm } from '../../types'
// import { st } from '../../styles/style-config'
// import { ResponsiveText } from '../ResponsiveText'
// import { AnyZodObject, TypeOf } from 'zod'

// // interface FormikCheckboxInputProps {
// //   className?: any
// //   id: string
// //   label?: string | undefined
  
// //   text_style?: 'regular' | 'bold'

// //   tabIndex: number

// //   eprops?: BoxProps

// //   /**
// //   * Formik handler onChange event is still fired. Afterwards, this would be called
// //   */
// //   onChange?: {
// //     (e: React.ChangeEvent<HTMLInputElement>): (void) | (Promise<void>);
// //     <T = string | React.ChangeEvent<HTMLInputElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLInputElement>) => (void) | (Promise<void>);
// //   }

// //   formik: BaseFormikForm
// // }

// type CommonProps = {
//   label?: string | undefined
//   text_style?: 'regular' | 'bold'
//   tabIndex: number
//   eprops?: BoxProps
  
//   /**
//   * Formik handler onChange event is still fired. Afterwards, this would be called
//   */
//   onChange?: {
//     (e: React.ChangeEvent<HTMLInputElement>): (void) | (Promise<void>);
//     <T = string | React.ChangeEvent<HTMLInputElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement> ? (void) | (Promise<void>) : (e: string | React.ChangeEvent<HTMLInputElement>) => (void) | (Promise<void>);
//   }
// }

// /** Takes a formik form schema and returns all object that can be used in a checkbox, ie booleans */ 
// type CheckboxIds<FormSchema extends AnyZodObject> = {
//   [K in keyof TypeOf<FormSchema> as TypeOf<FormSchema>[K] extends boolean ? K : never]: TypeOf<FormSchema>[K]
// }

// // type SelectionProps<FormSchema extends AnyZodObject> = FormSchema extends AnyZodObject ? {
// //   formik: FormikForm<FormSchema>['form_schema'],
// //   id: keyof CheckboxIds<FormSchema>
// // } : {
// //   formik: never
// //   id: never
// // }

// type SelectionProps<FormSchema extends AnyZodObject, Form extends FormikForm<FormSchema>> = Form extends FormikForm<FormSchema> ? {
//   formik: Form,
//   id: keyof CheckboxIds<FormSchema>
// } : {
//   formik: never
//   id: never
// }

// type FormikCheckboxInputProps<FormSchema extends AnyZodObject, Form extends FormikForm<FormSchema>> = CommonProps & CheckboxProps & SelectionProps<FormSchema, Form>

// const Base = <FormSchema extends AnyZodObject, Form extends FormikForm<FormSchema>>(props: FormikCheckboxInputProps<FormSchema, >) => {
//   const {
//     formik,
//     onChange,
//     text_style = 'bold',
//     className,
//     eprops = {},
//     id,
//     label = undefined,
//     mb = st.default_spacing(1),
//     tabIndex,
//     ...rest
//   } = props
  

//   // Hooks
//   const { values, isSubmitting, handleChange, handleBlur } = formik
  

//   const handleValueChange = async (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
//     handleChange(event)

//     if (typeof onChange === 'function') {
//       // eslint-disable-next-line @typescript-eslint/await-thenable
//       await onChange(event)
//     }
//   }


//   return (
//     <Box mb={mb}>
//       <FormControl display='flex' alignItems='center'>
//         <InputGroup size='sm'>
//           <>
//             <Checkbox 
//               className={className}
//               autoFocus={tabIndex === 1} 
//               isDisabled={isSubmitting || (formik.prev_fields_valid ? !formik.prev_fields_valid(id) : false)}
//               id={id} 
//               alt={label ?? 'checkbox field'} 
//               tabIndex={tabIndex}
//               color='text'
//               {...rest}
//               value={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? (values[id] ? values[id] : false) : false) : (values[id] ? values[id] : false)}
//               onChange={handleValueChange}
//               onBlur={handleBlur}
//               // _checked={{borderColor: 'red'}}
//               // sx={{'[data-checked]': {borderColor: border_color, background: 'transparent'}}}
//               sx={{
//                 '[data-checked]': {
//                   borderColor: 'brand',
//                   background: 'brand',
//                   color: 'white',
//                   _hover: {
//                     borderColor: 'brand',
//                     background: 'brand',
//                     color: 'white',
//                   }
//                 }
//               }}
//               _focusVisible={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}}
//               _hover={{borderColor: formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'border' : 'disabled_border') : 'border'}}
//               // colorScheme='transparent'
//               borderColor={formik.prev_fields_valid ? (formik.prev_fields_valid(id) ? 'light_border' : 'disabled_border') : 'light_border'}
//             >
//               <ResponsiveText variant='small'>{label}</ResponsiveText>
//             </Checkbox>
//           </>
//         </InputGroup>
//       </FormControl>
//     </Box>
//   )
// }


// export const FormikCheckboxInput = chakra(Base, {
//   shouldForwardProp: (prop) => true
// })