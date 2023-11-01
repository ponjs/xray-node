import { Form, Select, Switch } from 'antd'
import Certificate from './Certificate'
import { useEffect } from 'react'
import { useInbound } from '../../context'
import type { SwitchProps } from 'antd'

function XSwitch(
  props: Omit<SwitchProps, 'onChange'> & { onChange?: (checked?: boolean) => void }
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => props.onChange?.(props.checked), [props.checked])
  return <Switch {...props} />
}

const networkNamePath = ['stream', 'network']

export default function TLSSettings() {
  const inbound = useInbound()

  return (
    <>
      <Form.Item noStyle dependencies={['protocol', networkNamePath]}>
        {form => {
          const isCanSetTls = inbound.current?.canSetTls()
          const isCanSetXTls = inbound.current?.canEnableXTls()

          const options = [{ label: 'none', value: 'none' }]
          if (isCanSetTls) options.push({ label: 'tls', value: 'tls' })
          if (isCanSetXTls) options.push({ label: 'xtls', value: 'xtls' })

          const handleSecurityChange = (value: string) => {
            form.setFieldValue('tls', value === 'tls')
            form.setFieldValue('xtls', value === 'xtls')
          }

          return (
            <>
              <Form.Item
                label="security"
                name={['stream', 'security']}
                hidden={options.length <= 1}
              >
                <Select options={options} onChange={handleSecurityChange} />
              </Form.Item>

              <Form.Item name="tls" noStyle hidden valuePropName="checked">
                <XSwitch />
              </Form.Item>

              <Form.Item name="xtls" noStyle hidden valuePropName="checked">
                <XSwitch />
              </Form.Item>
            </>
          )
        }}
      </Form.Item>

      <Form.Item noStyle dependencies={['tls', 'xtls', networkNamePath]}>
        {form => {
          const { tls, xtls } = form.getFieldsValue()
          const network = form.getFieldValue(networkNamePath)

          if (tls || xtls) return <Certificate />
          if (network === 'tcp') {
            return (
              <Form.Item
                label="接受代理协议"
                name={['stream', 'tcp', 'acceptProxyProtocol']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            )
          }
        }}
      </Form.Item>
    </>
  )
}
