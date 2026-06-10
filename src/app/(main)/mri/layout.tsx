import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

const PAID_PLANS = ['silver', 'gold', 'platinum']

export default async function MRILayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role = session?.user?.role
  const sub = session?.user?.subscription ?? 'free'
  if (role !== 'admin' && !PAID_PLANS.includes(sub)) redirect('/pricing?locked=mri')
  return <>{children}</>
}
