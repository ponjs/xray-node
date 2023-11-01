'use client'

import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd'
import { useModels } from '../../request'
import type { Dayjs } from 'dayjs'

type TFormData = {
  name: string
  modelId: number
  total?: number
  expiryTime?: Dayjs
}

interface UserFormProps {
  record?: TUserRecord
  onCancel?: () => void
  onFinish?: () => void
}

export default function UserForm(props: UserFormProps) {
  const [form] = Form.useForm<TFormData>()
  const models = useModels()

  return (
    <Form className="pt-4" form={form} autoComplete="off" labelCol={{ span: 5 }}>
      <Form.Item
        label="用户名"
        name="name"
        rules={[{ required: true }]}
        normalize={value => value?.trim()}
      >
        <Input />
      </Form.Item>

      <Form.Item label="模型" name="modelId" rules={[{ required: true }]}>
        <Select
          loading={models.isLoading}
          options={models.data}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      </Form.Item>

      <Form.Item label="总流量" name="total">
        <InputNumber className="w-full" addonAfter="GB" min={0} placeholder="为空表示不限制" />
      </Form.Item>

      <Form.Item label="到期时间" name="expiryTime">
        <DatePicker className="w-full" placeholder="为空表示不限制" />
      </Form.Item>

      <Space className="w-full justify-end">
        <Button onClick={props.onCancel}>取消</Button>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Space>
    </Form>
  )
}
