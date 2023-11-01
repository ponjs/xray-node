import { Form, Select } from 'antd'
import InvariantForm from '@/components/InvariantForm'
import Fallbacks from '../Fallbacks'
import { FLOW_OPTIONS } from '../../constant'

export default function Trojan() {
  return (
    <>
      <Form.Item label="密码" name={['settings', 'clients', 0, 'password']}>
        <InvariantForm placeholder="十位置随机字符" fixedValue="<random>" />
      </Form.Item>

      <Form.Item noStyle dependencies={['xtls']}>
        {form =>
          form.getFieldValue('xtls') ? (
            <Form.Item label="flow" name={['settings', 'clients', 0, 'flow']}>
              <Select options={FLOW_OPTIONS} />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      <Fallbacks name={['settings', 'fallbacks']} />
    </>
  )
}
