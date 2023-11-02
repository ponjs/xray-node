import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
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
  const themeCookie = cookies().get('theme')

  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const theme = mediaQuery.matches ? 'dark' : 'light'
            document.cookie = \`theme=\$\{theme\}\`
            if (theme !== localStorage.getItem('theme')) {
              localStorage.setItem('theme', theme)
              location.reload()
            }
            mediaQuery.addEventListener('change', event => {
              const theme = event.matches ? 'dark' : 'light'
              document.cookie = \`theme=\$\{theme\}\`
              localStorage.setItem('theme', theme)
            })
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry darkMode={themeCookie?.value === 'dark'}>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
