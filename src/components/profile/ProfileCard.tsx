import * as Avatar from '@radix-ui/react-avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IUser } from '@/types/database'

interface ProfileCardProps {
  user: Pick<IUser, 'name' | 'email' | 'avatar' | 'organization' | 'country' | 'researchInterests' | 'bio'>
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar.Root className="h-20 w-20 rounded-full overflow-hidden bg-muted">
            <Avatar.Image src={user.avatar} alt={user.name} className="object-cover h-full w-full" />
            <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.organization && <p className="text-sm text-muted-foreground">{user.organization}</p>}
            {user.country && <p className="text-xs text-muted-foreground">{user.country}</p>}
          </div>
          {user.bio && <p className="text-sm text-muted-foreground line-clamp-3">{user.bio}</p>}
          {user.researchInterests && user.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {user.researchInterests.slice(0, 5).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
