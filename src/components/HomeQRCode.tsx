'use client'

import { QRCode, Spin } from 'antd'
import { useDarkMode, useSubLink } from '@/hooks'

export default function HomeQRCode({ name }: { name: string }) {
  const link = useSubLink(name)
  const isDarkMode = useDarkMode()

  return (
    <div className="flex items-center justify-center w-[180px] h-[180px] my-8 overflow-hidden select-none">
      <Spin spinning={!link}>
        {link && (
          <QRCode
            className="rounded-none dark:opacity-[0.85]"
            color="#000"
            bgColor="#fff"
            bordered={false}
            size={isDarkMode ? 192 : 206}
            value={link}
          />
        )}
      </Spin>
    </div>
  )
}
