import {
  AdminFormProps,
  AdminProps,
  BaseModel,
  FormField,
  HttpMethod,
  ModelDto,
  RegularActionProps,
  SelectField,
  SelectOptions,
} from '#admin/models'
import { isStringDateTime } from '#helpers/is_string_date_time'
import { SharedProps } from '@adonisjs/inertia/types'
import { RequestPayload } from '@inertiajs/core'
import { router } from '@inertiajs/react'
import {
  Button,
  Group,
  Input,
  Loader,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

export function AdminActionForm<Model extends BaseModel>(
  props: AdminProps & RegularActionProps & SharedProps
) {
  const formProps = props.actionProps as AdminFormProps<Model>

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: formProps.initialValues,
  })

  const fields = Object.entries(formProps.form.fields).map(
    ([, field]) => field as FormField<Model, keyof ModelDto<Model>>
  )

  const handleDateChange = (fieldName: string, newValue: Date | null) => {
    setValues((prev) => ({ ...prev, [fieldName]: newValue }))
    form.setFieldValue(fieldName, newValue)
  }

  // Creating a state for each date/datetime field
  const [values, setValues] = useState<Record<string, Date | null>>(() => {
    const states = fields
      .filter((field) => ['datetime', 'date'].includes(field.type))
      .reduce(
        (acc, field) => {
          const initialValue = form.values[field.accessKey]
          if (isStringDateTime(initialValue))
            acc[field.accessKey as string] = DateTime.fromISO(initialValue).toJSDate()
          else {
            acc[field.accessKey as string] = null
          }
          return acc
        },
        {} as Record<string, Date | null>
      )
    return states
  })

  const resolveFieldComponent = (field: FormField<Model, keyof ModelDto<Model, {}>>) => {
    const accessKey = field.accessKey as string
    switch (field.type) {
      case 'email':
      case 'text':
      case 'password':
      case 'tel':
        return (
          <TextInput
            key={accessKey}
            type={field.type}
            {...field.props}
            {...form.getInputProps(String(field.accessKey))}
            error={form.errors[field.accessKey]}
          />
        )
      case 'textarea':
        return (
          <Textarea
            key={accessKey}
            {...field.props}
            {...form.getInputProps(String(field.accessKey))}
            error={form.errors[field.accessKey]}
          />
        )
      case 'number':
        return (
          <NumberInput
            key={accessKey}
            {...field.props}
            {...form.getInputProps(String(field.accessKey))}
            error={form.errors[field.accessKey]}
          />
        )
      case 'select':
        const selectField = field as SelectField<Model, keyof ModelDto<Model>, {}>
        // SelectField doesnt represent the reality because
        // asynchronous functions have been resolved
        const options = selectField.options as unknown as SelectOptions
        return (
          <NativeSelect
            key={accessKey}
            required
            label={field.props.label}
            data={options}
            {...form.getInputProps(String(field.accessKey))}
            error={form.errors[field.accessKey]}
          >
            <option>---</option>
            {options?.map((fieldOption, index) => {
              return (
                <option key={index} value={fieldOption.value}>
                  {fieldOption.label}
                </option>
              )
            })}
          </NativeSelect>
        )

      case 'datetime':
      case 'date':
        return (
          <DatePickerInput
            key={accessKey}
            label={field.props.label}
            value={values[accessKey]}
            valueFormat="DD/MM/YYYY"
            // the form.getInputProps() will override the first onChange,
            // so it has to be done in the onChange prop
            onChange={(newValue) => handleDateChange(accessKey, newValue)}
            {...(() => {
              const { onChange, ...rest } = form.getInputProps(String(field.accessKey))
              return rest
            })()}
            error={form.errors[accessKey]}
          />
        )
      default:
        return (
          <Input
            key={accessKey}
            {...field.props}
            {...form.getInputProps(String(field.accessKey))}
          />
        )
    }
  }

  useEffect(() => {
    if (props.errors !== undefined) form.setErrors(props.errors)
  }, [props.errors])

  useEffect(() => setIsClicked(false), [props])

  const handleSubmit = (values: RequestPayload | undefined) => {
    setIsClicked(true)

    const handleActionMethod = {
      [HttpMethod.GET]: () => undefined,
      [HttpMethod.POST]: () => router.post(formProps.submitPath, { ...values }),
      [HttpMethod.DELETE]: () => undefined,
      [HttpMethod.PUT]: () => router.put(formProps.submitPath, { ...values }),
      [HttpMethod.PATCH]: () => router.patch(formProps.submitPath, { ...values }),
    }

    handleActionMethod[formProps.httpMethod]()
  }

  const [isClicked, setIsClicked] = useState(false)

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1 }}>
      {fields.map((field) => resolveFieldComponent(field))}
      <Group justify="flex-start" mt="md">
        <Button type="submit" disabled={isClicked}>
          {isClicked ? <Loader size="xs" /> : formProps.submitButtonLabel}
        </Button>
      </Group>
    </form>
  )
}
