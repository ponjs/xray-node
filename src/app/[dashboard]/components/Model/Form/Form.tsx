import { Button, Form, Input, Select, Space } from 'antd'
import PortRange from './components/PortRange'
import Trojan from './components/protocol/Trojan'
import StreamSettings from './components/stream'
import TLSSettings from './components/tls'
import Sniffing from './components/Sniffing'
import { useMemo, useRef } from 'react'
import { InboundContext } from './context'
import { PROTOCOL_OPTIONS } from './constant'
import { assignValues, toInboundJson } from '@/utils'
import { Inbound, Protocols } from '@/lib/xray.js'
import type { FieldData } from 'rc-field-form/lib/interface'
import type { TFormData } from './types'

interface ModelFormProps {
  record?: TModelRecord
  onCancel?: () => void
  onFinish?: () => void
}

export default function ModelForm({ record, onCancel }: ModelFormProps) {
  const [form] = Form.useForm<TFormData>()

  const inbound = useRef(
    record
      ? Inbound.fromJson({ protocol: record.protocol, ...toInboundJson(record) })
      : new Inbound(undefined, '', Protocols.TROJAN)
  )

  const initialValues = useMemo(
    () => ({
      name: record?.name || '',
      host: record?.host || '',
      port: record?.port || '',
      protocol: inbound.current.protocol,
      settings: inbound.current.settings,
      tls: inbound.current.tls,
      xtls: inbound.current.xtls,
      stream: inbound.current.stream,
      sniffing: inbound.current.sniffing,
    }),
    [record?.host, record?.name, record?.port]
  )

  const onFieldsChange = (changedFields: FieldData[]) => {
    changedFields.forEach(({ name, value }) => {
      if (!['name', 'host', 'port'].includes(name?.[0])) {
        assignValues(inbound.current, name, value)
      }
    })
  }

  return (
    <InboundContext.Provider value={inbound}>
      <Form
        className="pt-4"
        form={form}
        labelCol={{ span: 4 }}
        autoComplete="off"
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        onFinish={values => {
          console.log(values)
          console.log(inbound.current)
        }}
      >
        <Form.Item
          label="名称"
          name="name"
          normalize={value => value?.trim()}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="协议" name="protocol">
          <Select options={PROTOCOL_OPTIONS} />
        </Form.Item>

        <Form.Item label="地址" name="host">
          <Input />
        </Form.Item>

        <Form.Item label="端口范围" name="port" rules={[{ required: true }]}>
          <PortRange />
        </Form.Item>

        <Form.Item noStyle dependencies={['protocol']}>
          {_form => {
            switch (_form.getFieldValue('protocol')) {
              case Protocols.TROJAN:
                return <Trojan />
            }
          }}
        </Form.Item>

        <Form.Item noStyle dependencies={['protocol']}>
          {() => (inbound.current.canEnableStream() ? <StreamSettings /> : null)}
        </Form.Item>

        <TLSSettings />

        <Form.Item noStyle dependencies={['protocol']}>
          {() => (inbound.current.canSniffing() ? <Sniffing /> : null)}
        </Form.Item>

        <Space className="w-full justify-end">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Space>
      </Form>
    </InboundContext.Provider>
  )
}
