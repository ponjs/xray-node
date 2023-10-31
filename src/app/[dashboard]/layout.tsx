import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default function DashboardLayout({
  params,
  children,
  login,
}: {
  params: { dashboard: string }
  children: React.ReactNode
  login: React.ReactNode
}) {
  const pagePath = process.env.DASHBOARD_PATH?.replace(/^\/|\/$/, '') || 'dashboard'
  if (params.dashboard !== pagePath) {
    return notFound()
  }

  const cookieStore = cookies()
  const session = cookieStore.get('x_session')

  return <>{!session ? children : login}</>
}
