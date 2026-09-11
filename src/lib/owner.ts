// An email allowlist is only sufficient when the identity provider verified the email.
export function isOwnerEmail(email: string) {
  const configured = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return new Set(['mabrig1@gmail.com', 'victoryonline1@gmail.com', ...configured]).has(
    email.trim().toLowerCase(),
  )
}
