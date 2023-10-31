'use client'

import { Button, message } from 'antd'
import { CopyOutlined, LogoutOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function HomeActions({ link }: { link: string }) {
  const router = useRouter()
  const logout = async () => {
    await axios({
      url: '/api/logout',
      method: 'POST',
      withCredentials: true,
    })
    router.replace('/login')
  }

  return (
    <div className="flex items-center space-x-2">
      <CopyToClipboard text={link} onCopy={() => message.success('已复制')}>
        <Button type="text" icon={<CopyOutlined className="opacity-80 " />} title="复制链接" />
      </CopyToClipboard>
      <Button
        type="text"
        icon={<LogoutOutlined className="opacity-80 " />}
        title="退出登录"
        onClick={logout}
      />
    </div>
  )
}
