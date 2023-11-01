import { Input } from 'antd'
import { useEffect } from 'react'

interface InvariantFormProps {
  placeholder?: string
  fixedValue?: any
  value?: any
  onChange?: (value: any) => void
}

export default function InvariantForm(props: InvariantFormProps) {
  useEffect(() => {
    if (props.fixedValue !== props.value) {
      props.onChange?.(props.fixedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fixedValue, props.value])

  return <Input disabled placeholder={props.placeholder} />
}
