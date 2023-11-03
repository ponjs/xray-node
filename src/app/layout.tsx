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
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function setCookie(name, value) {
                document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/'
              }
              function getCookie(name) {
                return (
                  decodeURIComponent(
                    document.cookie.replace(
                      new RegExp(
                        '(?:(?:^|.*;)\\\\s*' +
                          encodeURIComponent(name).replace(/[-.+*]/g, '\\\\$&') +
                          '\\\\s*\\\\=\\\\s*([^;]*).*$)|^.*$'
                      ),
                      '$1'
                    )
                  ) || null
                )
              }
              const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
              const theme = mediaQuery.matches ? 'dark' : 'light'
              if (theme !== getCookie('theme')) {
                setCookie('theme', theme)
                location.reload()
              }
              mediaQuery.addEventListener('change', event => {
                setCookie('theme', event.matches ? 'dark' : 'light')
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
