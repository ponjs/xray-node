'use client'

import { ConfigProvider, theme } from 'antd'
import { useMemo } from 'react'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs/lib'
import { useServerInsertedHTML } from 'next/navigation'
import { useDarkMode } from '@/hooks'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type Entity from '@ant-design/cssinjs/es/Cache'

dayjs.locale('zh-cn')

export default function StyledComponentsRegistry({
  darkMode,
  children,
}: {
  darkMode?: boolean
  children?: React.ReactNode
}) {
  const browserDarkMode = useDarkMode()
  const cache = useMemo<Entity>(() => createCache(), [])
  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ))

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: browserDarkMode ?? darkMode ? theme.darkAlgorithm : undefined,
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  )
}
