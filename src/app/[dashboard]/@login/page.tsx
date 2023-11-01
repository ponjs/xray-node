'use client'

import { LoadingOutlined, SwapRightOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import Logo from '@/components/Logo'
import useSWRMutation from 'swr/mutation'
import axios from '../request'
import clsx from 'clsx'
import type { Rule } from 'antd/es/form'

type TFormData = { username: string; password: string }

const rules: Rule[] = [{ required: true, message: '' }]
const trim = (value?: string) => value?.trim()

export default function Login() {
  const [form] = Form.useForm<TFormData>()

  const { error, isMutating, reset, trigger } = useSWRMutation(
    '/api/dashboard/login',
    (url, { arg }: { arg: TFormData }) =>
      axios.post<TResponse>(url, arg).then(res => res.data.code !== 200 && Promise.reject(res)),
    {
      onSuccess: () => {
        location.reload()
      },
      onError: () => {
        setTimeout(reset, 500)
      },
    }
  )

  return (
    <div className="flex items-center justify-center h-full">
      <Form className="w-[280px]" form={form} autoComplete="off" onFinish={trigger}>
        <Logo className="mb-6" />

        <Form.Item name="username" normalize={trim} rules={rules}>
          <Input className="h-[42px]" placeholder="用户名" />
        </Form.Item>

        <Form.Item name="password" normalize={trim} rules={rules}>
          <Input.Password className="h-[42px]" placeholder="密码" />
        </Form.Item>

        <Form.Item className="text-right">
          <Button
            className={clsx('px-0', { 'animate-shake': error })}
            type="link"
            disabled={isMutating}
            htmlType="submit"
          >
            <div className="flex items-center space-x-2">
              <span>登录</span>
              {isMutating ? <LoadingOutlined /> : <SwapRightOutlined />}
            </div>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
