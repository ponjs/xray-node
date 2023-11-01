import { Form, Select } from 'antd'
import { NETWORK_OPTIONS } from '../../constant'

export default function StreamSettings() {
  const form = Form.useFormInstance()

  return (
    <Form.Item label="传输" name={['stream', 'network']}>
      <Select
        options={NETWORK_OPTIONS}
        onChange={value => {
          if (value === 'kcp') {
            form.setFieldValue('tls', false)
          }
        }}
      />
    </Form.Item>
  )
}
