import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PersonalGrantPipeline from './pipeline'

export const metadata = { title: 'Mabrig Personal Grant Pipeline | AfriGrantPipeline' }

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=%2Fdashboard%2Fpersonal-grant-pipeline')
  if (session.user.role !== 'admin') redirect('/admin')

  return (
    <PersonalGrantPipeline
      name={session.user.name || 'Mabrig Korie'}
      email={session.user.email || ''}
    />
  )
}
