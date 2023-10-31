import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import StyledComponentsRegistry from '../lib/AntdRegistry'
import 'tailwindcss/tailwind.css'
import '../styles/preflight.css'
import '../styles/global.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XNode',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
