'use client'

import { Form, Input } from 'antd'
import { LoadingOutlined, SwapRightOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import axios from 'axios'
import clsx from 'clsx'
import styles from './Form.module.css'

type TFormData = { username: string }

export default function LoginForm() {
  const [form] = Form.useForm<TFormData>()
  const router = useRouter()

  const { error, isMutating, reset, trigger } = useSWRMutation(
    '/api/login',
    (url, { arg }: { arg: TFormData }) =>
      axios
        .post<TResponse>(url, arg, { withCredentials: true })
        .then(res => res.data.code !== 200 && Promise.reject(res)),
    {
      onSuccess: () => {
        router.replace('/')
      },
      onError: () => {
        setTimeout(reset, 500)
      },
    }
  )

  const handleClickIcon = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    form.submit()
  }

  return (
    <Form form={form} autoComplete="off" onFinish={trigger}>
      <Form.Item
        name="username"
        normalize={value => value?.trim()}
        validateStatus={error ? 'error' : 'validating'}
      >
        <Input
          className={clsx(styles.input, { 'animate-shake': error })}
          suffix={
            isMutating ? (
              <LoadingOutlined className={styles.icon} />
            ) : (
              <SwapRightOutlined className={styles.icon} onClick={handleClickIcon} />
            )
          }
          placeholder="输入用户名"
        />
      </Form.Item>
    </Form>
  )
}
