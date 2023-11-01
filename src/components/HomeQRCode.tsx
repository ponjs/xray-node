'use client'

import { QRCode, Spin } from 'antd'
import { useSubLink } from '@/hooks'

export default function HomeQRCode({ name }: { name: string }) {
  const link = useSubLink(name)

  return (
    <div className="flex items-center justify-center w-[180px] h-[180px] my-6 overflow-hidden select-none">
      <Spin spinning={!link}>{link && <QRCode bordered={false} size={206} value={link} />}</Spin>
    </div>
  )
}
