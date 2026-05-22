import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { IGrant } from '@/types/database'

interface GrantCardProps {
  grant: Pick<IGrant, '_id' | 'title' | 'funder' | 'description' | 'amount' | 'currency' | 'deadline' | 'categories'>
}

export default function GrantCard({ grant }: GrantCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-1">{grant.title}</CardTitle>
            <CardDescription className="mt-1">{grant.funder}</CardDescription>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-primary">
              {grant.currency} {grant.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{grant.description}</p>
        <div className="flex flex-wrap gap-1">
          {grant.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            Deadline: {format(new Date(grant.deadline), 'MMM d, yyyy')}
          </p>
          <Link href={`/grants/${grant._id}`}>
            <Button size="sm" variant="outline">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
