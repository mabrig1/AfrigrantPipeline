import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IArticle } from '@/types/database'

interface ArticleCardProps {
  article: Pick<IArticle, '_id' | 'title' | 'abstract' | 'keywords' | 'status' | 'publishedAt' | 'createdAt'>
}

const statusVariant: Record<IArticle['status'], 'outline' | 'secondary' | 'warning' | 'success' | 'destructive'> = {
  draft: 'outline',
  submitted: 'secondary',
  under_review: 'warning',
  published: 'success',
  rejected: 'destructive',
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
          <Badge variant={statusVariant[article.status]} className="shrink-0 capitalize">
            {article.status.replace('_', ' ')}
          </Badge>
        </div>
        {article.publishedAt && (
          <CardDescription>Published {format(new Date(article.publishedAt), 'MMM d, yyyy')}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{article.abstract}</p>
        <div className="flex flex-wrap gap-1">
          {article.keywords.slice(0, 4).map((kw) => (
            <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
          ))}
        </div>
        <Link
          href={`/research/${article._id}`}
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  )
}
