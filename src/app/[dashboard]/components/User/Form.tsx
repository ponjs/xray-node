import { Button, DatePicker, Form, Input, InputNumber, Select, Space, message } from 'antd'
import useSWRMutation from 'swr/mutation'
import request, { useModels, useUsers } from '../../request'
import type { Dayjs } from 'dayjs'
import { useMemo } from 'react'
import { ONE_GB, toFixed } from '@/utils'
import dayjs from 'dayjs'

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

export default function UserForm({ record, onCancel, onFinish }: UserFormProps) {
  const [form] = Form.useForm<TFormData>()

  const models = useModels()
  const users = useUsers()

  const initialValues = useMemo<Partial<TFormData>>(
    () => ({
      name: record?.name,
      modelId: record?.model.id,
      total: record?.inbound?.total ? toFixed(record?.inbound?.total / ONE_GB, 2) : undefined,
      expiryTime: record?.inbound?.expiryTime ? dayjs(record?.inbound?.expiryTime) : undefined,
    }),
    [record?.inbound?.expiryTime, record?.inbound?.total, record?.model.id, record?.name]
  )

  const { isMutating, trigger } = useSWRMutation(
    '/api/dashboard/user/upsert',
    (url, { arg }: { arg: TFormData }) =>
      request.post<TResponse>(url, {
        ...arg,
        expiryTime: arg.expiryTime?.hour(23).minute(59).second(59).valueOf(),
        id: record?.id,
      }),
    {
      onSuccess: res => {
        if (res.data.code === 200) {
          message.success('保存成功')
          onFinish?.()
          users.mutate()
        }
      },
    }
  )

  return (
    <Form
      className="pt-4"
      form={form}
      autoComplete="off"
      labelCol={{ span: 5 }}
      initialValues={initialValues}
      onFinish={trigger}
    >
      <Form.Item
        label="用户名"
        name="name"
        rules={[{ required: true }]}
        normalize={value => value?.trim()}
      >
        <Input disabled={!!record} />
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
        <Button onClick={onCancel}>取消</Button>
        <Button loading={isMutating} type="primary" htmlType="submit">
          保存
        </Button>
      </Space>
    </Form>
  )
}
