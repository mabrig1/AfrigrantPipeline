import type {
  UserRole,
  GrantStatus,
  GrantType,
  ApplicationStatus,
  ArticleStatus,
  ArticleLicense,
  PeerReviewStatus,
  PeerReviewRecommendation,
  CollaborationStatus,
  MentorshipStatus,
  MeetingFrequency,
} from '@/types/database'

// ── Base URL ──────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// ── Response envelope ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ── Error class ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Serialized response types ─────────────────────────────────────────────────
//
// The Railway API returns JSON, so ObjectIds become strings and Dates become
// ISO strings. These types represent exactly what components receive.

export interface UserResponse {
  _id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  bio?: string
  avatar?: string
  researchInterests?: string[]
  country?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface GrantResponse {
  _id: string
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: string
  status: GrantStatus
  grantType: GrantType
  eligibility: string[]
  categories: string[]
  countries: string[]
  region?: string
  applicationLink?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationResponse {
  _id: string
  grant: string | GrantResponse
  applicant: string | UserResponse
  status: ApplicationStatus
  projectTitle: string
  projectDescription: string
  requestedAmount: number
  attachments: string[]
  aiScore?: number
  reviewerNotes?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface JournalResponse {
  _id: string
  name: string
  description: string
  issn?: string
  editors: string[] | UserResponse[]
  categories: string[]
  isOpenAccess: boolean
  website?: string
  impactFactor?: number
  submissionGuidelines?: string
  createdAt: string
  updatedAt: string
}

export interface ArticleResponse {
  _id: string
  title: string
  abstract: string
  content: string
  authors: string[] | UserResponse[]
  journal?: string | JournalResponse
  keywords: string[]
  status: ArticleStatus
  doi?: string
  attachments: string[]
  viewCount: number
  language: string
  license: ArticleLicense
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PeerReviewResponse {
  _id: string
  article: string | ArticleResponse
  reviewer: string | UserResponse
  status: PeerReviewStatus
  recommendation: PeerReviewRecommendation | null
  comments?: string
  dueDate: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CollaborationResponse {
  _id: string
  title: string
  description: string
  owner: string | UserResponse
  members: string[] | UserResponse[]
  status: CollaborationStatus
  tags: string[]
  requiredSkills: string[]
  maxMembers?: number
  deadline?: string
  createdAt: string
  updatedAt: string
}

export interface MentorshipResponse {
  _id: string
  mentor: string | UserResponse
  mentee: string | UserResponse
  topic: string
  status: MentorshipStatus
  message?: string
  goals: string[]
  meetingFrequency: MeetingFrequency
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

// ── Request body types ────────────────────────────────────────────────────────

export interface RegisterBody {
  name: string
  email: string
  password: string
  organization?: string
  role?: 'student' | 'researcher' | 'lecturer' | 'institution'
}

export interface CreateGrantBody {
  title: string
  description: string
  funder: string
  amount: number
  currency?: string
  deadline: string
  grantType?: GrantType
  eligibility?: string[]
  categories?: string[]
  countries?: string[]
  region?: string
  applicationLink?: string
}

export interface CreateApplicationBody {
  grant: string
  projectTitle: string
  projectDescription: string
  requestedAmount: number
  attachments?: string[]
}

export interface CreateArticleBody {
  title: string
  abstract: string
  content: string
  keywords?: string[]
  journal?: string
  attachments?: string[]
  language?: string
  license?: ArticleLicense
}

export interface CreateCollaborationBody {
  title: string
  description: string
  tags?: string[]
  requiredSkills?: string[]
  maxMembers?: number
  deadline?: string
}

export interface RequestMentorshipBody {
  mentor: string
  topic: string
  message?: string
  goals?: string[]
  meetingFrequency?: MeetingFrequency
}

export interface UpdateProfileBody {
  name?: string
  bio?: string
  organization?: string
  country?: string
  researchInterests?: string[]
  avatar?: string
  website?: string
}

export interface GrantListParams {
  status?: GrantStatus
  grantType?: GrantType
  region?: string
  categories?: string
  search?: string
  page?: number
  limit?: number
}

export interface ArticleListParams {
  status?: ArticleStatus
  journal?: string
  search?: string
  page?: number
  limit?: number
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  next?: { revalidate?: number; tags?: string[] }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
  token?: string,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  // Handle non-JSON responses (e.g. 502 from Railway cold start)
  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return {
      data: null,
      error: `Server error (${res.status})`,
      message: null,
    }
  }

  const json = (await res.json()) as {
    data?: T
    error?: string
    message?: string
  }

  if (!res.ok) {
    return {
      data: null,
      error: json.error ?? `Request failed with status ${res.status}`,
      message: json.message ?? null,
    }
  }

  return {
    data: (json.data ?? json) as T,
    error: null,
    message: json.message ?? null,
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
  return q ? `?${q}` : ''
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: RegisterBody) =>
    apiFetch<{ id: string }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

// ── Grants ────────────────────────────────────────────────────────────────────

export const grantsApi = {
  list: (params: GrantListParams = {}, token?: string) =>
    apiFetch<GrantResponse[]>(
      `/api/v1/grants${buildQuery(params as Record<string, string | number | boolean | undefined>)}`,
      { next: { revalidate: 300, tags: ['grants'] } },
      token,
    ),

  get: (id: string, token?: string) =>
    apiFetch<GrantResponse>(`/api/v1/grants/${id}`, { next: { revalidate: 300 } }, token),

  create: (body: CreateGrantBody, token: string) =>
    apiFetch<GrantResponse>('/api/v1/grants', { method: 'POST', body: JSON.stringify(body) }, token),

  update: (id: string, body: Partial<CreateGrantBody>, token: string) =>
    apiFetch<GrantResponse>(`/api/v1/grants/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),

  bookmark: (grantId: string, token: string) =>
    apiFetch<{ bookmarked: boolean }>(`/api/v1/grants/${grantId}/bookmark`, { method: 'POST' }, token),

  bookmarks: (token: string) =>
    apiFetch<GrantResponse[]>('/api/v1/grants/bookmarks', {}, token),
}

// ── Applications ──────────────────────────────────────────────────────────────

export const applicationsApi = {
  list: (token: string) =>
    apiFetch<ApplicationResponse[]>('/api/v1/applications', {}, token),

  get: (id: string, token: string) =>
    apiFetch<ApplicationResponse>(`/api/v1/applications/${id}`, {}, token),

  create: (body: CreateApplicationBody, token: string) =>
    apiFetch<ApplicationResponse>('/api/v1/applications', { method: 'POST', body: JSON.stringify(body) }, token),

  updateStatus: (id: string, status: ApplicationStatus, token: string) =>
    apiFetch<ApplicationResponse>(
      `/api/v1/applications/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      token,
    ),

  submit: (id: string, token: string) =>
    apiFetch<ApplicationResponse>(`/api/v1/applications/${id}/submit`, { method: 'POST' }, token),
}

// ── Articles ──────────────────────────────────────────────────────────────────

export const articlesApi = {
  list: (params: ArticleListParams = {}, token?: string) =>
    apiFetch<ArticleResponse[]>(
      `/api/v1/articles${buildQuery(params as Record<string, string | number | boolean | undefined>)}`,
      { next: { revalidate: 600, tags: ['articles'] } },
      token,
    ),

  get: (id: string, token?: string) =>
    apiFetch<ArticleResponse>(`/api/v1/articles/${id}`, { next: { revalidate: 600 } }, token),

  create: (body: CreateArticleBody, token: string) =>
    apiFetch<ArticleResponse>('/api/v1/articles', { method: 'POST', body: JSON.stringify(body) }, token),

  update: (id: string, body: Partial<CreateArticleBody>, token: string) =>
    apiFetch<ArticleResponse>(`/api/v1/articles/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
}

// ── Journals ──────────────────────────────────────────────────────────────────

export const journalsApi = {
  list: (token?: string) =>
    apiFetch<JournalResponse[]>('/api/v1/journals', { next: { revalidate: 3600, tags: ['journals'] } }, token),

  get: (id: string, token?: string) =>
    apiFetch<JournalResponse>(`/api/v1/journals/${id}`, { next: { revalidate: 3600 } }, token),

  create: (
    body: { name: string; description: string; categories?: string[]; isOpenAccess?: boolean; website?: string },
    token: string,
  ) => apiFetch<JournalResponse>('/api/v1/journals', { method: 'POST', body: JSON.stringify(body) }, token),
}

// ── Peer Reviews ──────────────────────────────────────────────────────────────

export const peerReviewsApi = {
  listForArticle: (articleId: string, token: string) =>
    apiFetch<PeerReviewResponse[]>(`/api/v1/articles/${articleId}/reviews`, {}, token),

  listMine: (token: string) =>
    apiFetch<PeerReviewResponse[]>('/api/v1/peer-reviews/mine', {}, token),

  submit: (
    id: string,
    body: { recommendation: PeerReviewRecommendation; comments?: string },
    token: string,
  ) =>
    apiFetch<PeerReviewResponse>(
      `/api/v1/peer-reviews/${id}/submit`,
      { method: 'POST', body: JSON.stringify(body) },
      token,
    ),
}

// ── Collaborations ────────────────────────────────────────────────────────────

export const collaborationsApi = {
  list: (params: { status?: CollaborationStatus; search?: string } = {}, token?: string) =>
    apiFetch<CollaborationResponse[]>(
      `/api/v1/collaborations${buildQuery(params as Record<string, string | number | boolean | undefined>)}`,
      { next: { revalidate: 300, tags: ['collaborations'] } },
      token,
    ),

  get: (id: string, token?: string) =>
    apiFetch<CollaborationResponse>(`/api/v1/collaborations/${id}`, {}, token),

  create: (body: CreateCollaborationBody, token: string) =>
    apiFetch<CollaborationResponse>('/api/v1/collaborations', { method: 'POST', body: JSON.stringify(body) }, token),

  join: (id: string, token: string) =>
    apiFetch<CollaborationResponse>(`/api/v1/collaborations/${id}/join`, { method: 'POST' }, token),

  leave: (id: string, token: string) =>
    apiFetch<CollaborationResponse>(`/api/v1/collaborations/${id}/leave`, { method: 'POST' }, token),
}

// ── Mentorships ───────────────────────────────────────────────────────────────

export const mentorshipsApi = {
  list: (token: string) =>
    apiFetch<MentorshipResponse[]>('/api/v1/mentorships', {}, token),

  request: (body: RequestMentorshipBody, token: string) =>
    apiFetch<MentorshipResponse>('/api/v1/mentorships', { method: 'POST', body: JSON.stringify(body) }, token),

  updateStatus: (id: string, status: MentorshipStatus, token: string) =>
    apiFetch<MentorshipResponse>(
      `/api/v1/mentorships/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      token,
    ),
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export const profilesApi = {
  get: (userId: string, token?: string) =>
    apiFetch<UserResponse>(`/api/v1/profiles/${userId}`, { next: { revalidate: 300 } }, token),

  getMe: (token: string) =>
    apiFetch<UserResponse>('/api/v1/profiles/me', {}, token),

  update: (body: UpdateProfileBody, token: string) =>
    apiFetch<UserResponse>('/api/v1/profiles/me', { method: 'PATCH', body: JSON.stringify(body) }, token),
}

// ── AI ────────────────────────────────────────────────────────────────────────

export const aiApi = {
  assist: (body: { prompt: string; context?: string }, token: string) =>
    apiFetch<{ result: string }>('/api/v1/ai/assist', { method: 'POST', body: JSON.stringify(body) }, token),

  improveAbstract: (abstract: string, token: string) =>
    apiFetch<{ result: string }>(
      '/api/v1/ai/improve-abstract',
      { method: 'POST', body: JSON.stringify({ abstract }) },
      token,
    ),

  scoreApplication: (applicationId: string, token: string) =>
    apiFetch<{ score: number; feedback: string }>(
      `/api/v1/ai/score-application/${applicationId}`,
      { method: 'POST' },
      token,
    ),
}
