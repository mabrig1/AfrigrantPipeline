import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { journalsApi } from '@/lib/api'
import SubmitArticleForm from '@/components/articles/SubmitArticleForm'

export const metadata = { title: 'Submit Research — AfriPublish' }

export default async function SubmitArticlePage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/publish/submit')
  }

  const { data: journals } = await journalsApi.list()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Submit Your Research
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your work with the African research community. All submissions are
          peer-reviewed before publication.
        </p>
      </div>

      <SubmitArticleForm journals={journals ?? []} />
    </div>
  )
}
