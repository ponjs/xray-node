import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import StyledComponentsRegistry from '../lib/AntdRegistry'
import 'tailwindcss/tailwind.css'
import '../styles/preflight.css'
import '../styles/global.css'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XNode',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
