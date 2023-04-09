import { FormikProps } from 'formik'
import { AnyZodObject, TypeOf } from 'zod'

// Add optional logic to show toltip
// Add min and max to FormikInput
// Add showErrors logic to show error after first submit butt
// Add finish
// Make submit button work better

export type BaseFormikForm = FormikProps<any> & {
  form_schema?: AnyZodObject
  fieldHasErrors?: (id: any) => boolean
  fieldIsValid?: (id: any) => boolean
  field_order?: string[]
  prev_fields_valid?: any
  // setValue: (id: string, value?: any | null, shouldValidate?: boolean) => boolean
}

export type FormikForm<FormSchema extends AnyZodObject> = FormikProps<TypeOf<FormSchema>> & {
  form_schema: FormSchema
  fieldHasErrors: (id: keyof TypeOf<FormSchema>) => boolean
  fieldIsValid: (id: keyof TypeOf<FormSchema>) => boolean
  prev_fields_valid: (id: keyof TypeOf<FormSchema>) => boolean
  field_order?: (keyof TypeOf<FormSchema>)[]
  setValue: <Id extends keyof TypeOf<FormSchema>>(id: Id, value?: TypeOf<FormSchema>[Id] | null, shouldValidate?: boolean) => boolean
}

export type UseFormikFormProps<FormSchema extends AnyZodObject> = {
  form_schema: FormSchema,
  submit?: (values: TypeOf<FormSchema>) => Promise<void> | void
  initial_values?: Partial<TypeOf<FormSchema>>
  log?: boolean
  field_order?: (keyof TypeOf<FormSchema>)[]
}