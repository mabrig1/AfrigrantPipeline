const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

type ApiResponse<T> = {
  data: T | null
  error: string | null
  message: string | null
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok) {
    return { data: null, error: json.error ?? 'Request failed', message: json.message ?? null }
  }
  return { data: json.data ?? json, error: null, message: json.message ?? null }
}

// ── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { name: string; email: string; password: string; organization?: string }) =>
    apiFetch<{ id: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Grants ───────────────────────────────────────────────────────
export const grantsApi = {
  list: (status = 'open', token?: string) =>
    apiFetch<unknown[]>(`/api/grants?status=${status}`, {}, token),

  get: (id: string, token?: string) =>
    apiFetch<unknown>(`/api/grants/${id}`, {}, token),

  create: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/grants', { method: 'POST', body: JSON.stringify(body) }, token),

  bookmark: (grantId: string, token: string) =>
    apiFetch<unknown>(`/api/grants/${grantId}/bookmark`, { method: 'POST' }, token),
}

// ── Applications ─────────────────────────────────────────────────
export const applicationsApi = {
  list: (token: string) =>
    apiFetch<unknown[]>('/api/applications', {}, token),

  get: (id: string, token: string) =>
    apiFetch<unknown>(`/api/applications/${id}`, {}, token),

  create: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/applications', { method: 'POST', body: JSON.stringify(body) }, token),

  updateStatus: (id: string, status: string, token: string) =>
    apiFetch<unknown>(`/api/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token),
}

// ── Articles ─────────────────────────────────────────────────────
export const articlesApi = {
  list: (token?: string) =>
    apiFetch<unknown[]>('/api/articles', {}, token),

  get: (id: string, token?: string) =>
    apiFetch<unknown>(`/api/articles/${id}`, {}, token),

  create: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/articles', { method: 'POST', body: JSON.stringify(body) }, token),
}

// ── Collaborations ───────────────────────────────────────────────
export const collaborationsApi = {
  list: (token?: string) =>
    apiFetch<unknown[]>('/api/collaborations', {}, token),

  create: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/collaborations', { method: 'POST', body: JSON.stringify(body) }, token),

  join: (id: string, token: string) =>
    apiFetch<unknown>(`/api/collaborations/${id}/join`, { method: 'POST' }, token),
}

// ── Mentorships ──────────────────────────────────────────────────
export const mentorshipsApi = {
  list: (token?: string) =>
    apiFetch<unknown[]>('/api/mentorships', {}, token),

  request: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/mentorships', { method: 'POST', body: JSON.stringify(body) }, token),
}

// ── AI ───────────────────────────────────────────────────────────
export const aiApi = {
  assist: (prompt: string, context: string | undefined, token: string) =>
    apiFetch<{ result: string }>('/api/ai/assist', {
      method: 'POST',
      body: JSON.stringify({ prompt, context }),
    }, token),
}

// ── Profiles ─────────────────────────────────────────────────────
export const profilesApi = {
  get: (userId: string, token?: string) =>
    apiFetch<unknown>(`/api/profiles/${userId}`, {}, token),

  update: (body: unknown, token: string) =>
    apiFetch<unknown>('/api/profiles/me', { method: 'PATCH', body: JSON.stringify(body) }, token),
}
