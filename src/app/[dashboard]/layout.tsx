import { dashboardVerify } from '@/lib/cookie'
import { notFound } from 'next/navigation'

export default async function DashboardLayout({
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

  const result = await dashboardVerify()

  return <>{result ? children : login}</>
}
