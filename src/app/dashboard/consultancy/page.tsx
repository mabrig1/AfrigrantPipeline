import { auth } from '@/lib/auth'
import ConsultancyWorkspace from './workspace'
export const metadata = { title: 'Consultancy workspace | AfriGrantPipeline' }
export default async function Page() {
  const session = await auth()
  return (
    <ConsultancyWorkspace
      name={session?.user?.name || ''}
      email={session?.user?.email || ''}
    />
  )
}
