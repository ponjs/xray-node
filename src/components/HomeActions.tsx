'use client'

import { Button, message } from 'antd'
import { CopyOutlined, LoadingOutlined, LogoutOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRouter } from 'next/navigation'
import { useSubLink } from '@/hooks'
import useSWRMutation from 'swr/mutation'
import axios from 'axios'

export default function HomeActions({ name }: { name: string }) {
  const link = useSubLink(name)

  const router = useRouter()
  const { isMutating, trigger } = useSWRMutation(
    '/api/logout',
    url => axios.post(url, { withCredentials: true }),
    {
      onSuccess: () => router.replace('/login'),
    }
  )

  return (
    <div className="flex items-center space-x-2 opacity-60">
      <CopyToClipboard text={link} onCopy={() => message.success('已复制')}>
        <Button type="text" icon={<CopyOutlined />} title="复制链接" />
      </CopyToClipboard>
      <Button
        type="text"
        icon={isMutating ? <LoadingOutlined /> : <LogoutOutlined />}
        title="退出登录"
        onClick={() => trigger()}
      />
    </div>
  )
}
