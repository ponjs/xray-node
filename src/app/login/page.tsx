import Form from './Form'
import { verifySession } from '@/lib/cookie'
import { redirect } from 'next/navigation'

export default async function Login() {
  const userinfo = await verifySession()

  if (userinfo) return redirect('/')

  return (
    <div className="flex items-center justify-center h-full">
      <Form />
    </div>
  )
}
