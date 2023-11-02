import { verifyManages } from '@/lib/cookie'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    {
      dashboard: process.env.DASHBOARD_PATH?.replace(/^\/|\/$/, '') || 'dashboard',
    },
  ]
}

export default async function DashboardLayout({
  children,
  login,
}: {
  children: React.ReactNode
  login: React.ReactNode
}) {
  return <>{(await verifyManages()) ? children : login}</>
}
