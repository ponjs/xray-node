import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const theme = cookies().get('theme')?.value || 'light'
  const color = theme === 'dark' ? '#000' : '#fff'

  return Response.json({
    name: 'XNode',
    short_name: 'XNode',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    theme_color: color,
    background_color: color,
    icons: [
      {
        src: '/logo.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '168x168',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  })
}
