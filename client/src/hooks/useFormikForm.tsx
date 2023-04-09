import { FormikHelpers, useFormik } from 'formik'
import { AnyZodObject, TypeOf } from 'zod'
import { FormikForm, UseFormikFormProps } from '../types'

export const useFormikForm = <FormSchema extends AnyZodObject>(props: UseFormikFormProps<FormSchema>): FormikForm<FormSchema> => {

  const {
    form_schema,
    initial_values = {},
    log = false,
    submit = undefined,
    field_order = undefined,
  } = props

  const formik = useFormik({
    enableReinitialize: true, // If false, then values can't be modified programatically
    initialValues: initial_values as TypeOf<FormSchema>,
    validate: (values) => {
      if (!form_schema) return
      try { form_schema.parse(values) } 
      catch (error: any) {
        // console.log(values)
        if (error.formErrors) {
          if (log) console.log(error.formErrors)
          return error.formErrors.fieldErrors
        }
        else {
          if (log) console.log(error)
          return error
        }
      }
    },
    onSubmit: (values: TypeOf<FormSchema>, { setSubmitting }: FormikHelpers<TypeOf<FormSchema>>) => {
      (async () => {
        setSubmitting(true)

        if (typeof submit === 'function') {
          await submit(values)
        }

        setSubmitting(false)
      })().catch(console.log)
    }
  })

  const fieldHasError = (id: keyof TypeOf<FormSchema>): boolean => {
    try {
      const error = formik.errors[id]
      if (error) {
        if (typeof error === 'string') {
          if (error === 'Required') return false
          return error.length > 0 && formik.touched[id] && formik.getFieldProps(id).value
        }
      }
    }
    catch {
      return false
    }
    return false
  }

  const fieldIsValid = (id: keyof TypeOf<FormSchema>): boolean => formik.getFieldProps(id).value && !fieldHasError(id)

  const prev_fields_valid = (id: keyof TypeOf<FormSchema>) => {
    if (field_order) {
      if (field_order.length > 0) {
        let order = field_order.indexOf(id)
        // if (order === -1) order = field_order.length
        if (order === -1) order = 0
        
        if (order === 0) return true

        for (let i = 0; i < order; i++) {
          if (!fieldIsValid(field_order[i])) return false  
        }

        return true
      }
      else return true
    }
    else {
      // Since field_order is undefined, it means we don't
      // have to wait for previous fields to be filled
      return true
    }
  }

  // A type safe function to set a value
  const setValue = <Id extends keyof TypeOf<FormSchema>>(id: Id, value?: TypeOf<FormSchema>[Id] | null, shouldValidate?: boolean): boolean => {
    try {
      formik.getFieldHelpers(id as string).setValue(value === null ? undefined : value, shouldValidate)

      return true
    }
    catch {
      return false
    }
  }

  
  // The way field_order will work is that every formik field will see if their id is in the array
  // If it is, then field is disabled until fields before that one are filled
  // If id is not in array, then field is disabled until ALL fields in the array are filled

  return {
    ...formik,
    form_schema: form_schema,
    fieldHasErrors: fieldHasError,
    fieldIsValid: fieldIsValid,
    field_order: field_order,
    prev_fields_valid: prev_fields_valid,
    setValue: setValue
  }
}