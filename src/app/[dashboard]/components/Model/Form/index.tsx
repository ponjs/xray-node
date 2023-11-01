import { Button, Form, Input, Select, Space, message } from 'antd'
import PortRange from './components/PortRange'
import Trojan from './components/protocol/Trojan'
import StreamSettings from './components/stream'
import TLSSettings from './components/tls'
import Sniffing from './components/Sniffing'
import useSWRMutation from 'swr/mutation'
import { useMemo, useRef } from 'react'
import { InboundContext } from './context'
import { PROTOCOL_OPTIONS } from './constant'
import { organizeObject } from '@/utils'
import { Inbound, Protocols } from '@/lib/xray.js'
import toInbound from '@/lib/services/toInbound'
import qs from 'qs'
import request, { useModels } from '../../../request'
import type { FieldData } from 'rc-field-form/lib/interface'
import type { TFormData } from './types'

interface ModelFormProps {
  record?: TModelRecord
  onCancel?: () => void
  onFinish?: () => void
}

export default function ModelForm({ record, onCancel, onFinish }: ModelFormProps) {
  const [form] = Form.useForm<TFormData>()
  const models = useModels()

  const inbound = useRef(
    record
      ? toInbound({
          protocol: record.protocol,
          settings: record.settings,
          streamSettings: record.streamSettings,
          sniffing: record.sniffing,
        })
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
        organizeObject(inbound.current, name, value)
      }
    })
  }

  const { isMutating, trigger } = useSWRMutation(
    '/api/dashboard/model/upsert',
    (url, { arg }: { arg: TFormData }) =>
      request.post<TResponse>(
        url,
        qs.stringify({
          id: record?.id,
          name: arg.name,
          host: arg.host,
          port: arg.port,
          protocol: inbound.current.protocol,
          settings: inbound.current.settings?.toString(),
          streamSettings: inbound.current.stream.toString(),
          sniffing: inbound.current.canSniffing() ? inbound.current.sniffing.toString() : '{}',
        })
      ),
    {
      onSuccess: res => {
        if (res.data.code === 200) {
          message.success('保存成功')
          onFinish?.()
          models.mutate()
        }
      },
    }
  )

  return (
    <InboundContext.Provider value={inbound}>
      <Form
        className="pt-4"
        form={form}
        labelCol={{ span: 4 }}
        autoComplete="off"
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        onFinish={trigger}
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
          <Button type="primary" htmlType="submit" loading={isMutating}>
            保存
          </Button>
        </Space>
      </Form>
    </InboundContext.Provider>
  )
}
