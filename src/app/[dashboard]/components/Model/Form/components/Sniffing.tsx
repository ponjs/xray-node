import { Form, Switch } from 'antd'

export default function Sniffing() {
  return (
    <Form.Item label="sniffing" name={['sniffing', 'enabled']} valuePropName="checked">
      <Switch />
    </Form.Item>
  )
}
