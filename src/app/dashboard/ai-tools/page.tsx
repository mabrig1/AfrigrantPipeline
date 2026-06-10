import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AIToolsClient from './AIToolsClient'

export const metadata = { title: 'AI Grant Writer — Admin' }

export default async function AIToolsPage() {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/dashboard')
  return <AIToolsClient />
}
