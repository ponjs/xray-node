'use client'

import { useMemo } from 'react'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs/lib'
import { useServerInsertedHTML } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type Entity from '@ant-design/cssinjs/es/Cache'

dayjs.locale('zh-cn')

export default function StyledComponentsRegistry({ children }: React.PropsWithChildren) {
  const cache = useMemo<Entity>(() => createCache(), [])
  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ))
  return <StyleProvider cache={cache}>{children}</StyleProvider>
}
