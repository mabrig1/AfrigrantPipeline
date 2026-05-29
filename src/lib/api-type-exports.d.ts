declare module '@/lib/api' {
  export type UserRole = import('@/types/database').UserRole
  export type GrantStatus = import('@/types/database').GrantStatus
  export type GrantType = import('@/types/database').GrantType
  export type ApplicationStatus = import('@/types/database').ApplicationStatus
  export type ArticleStatus = import('@/types/database').ArticleStatus
  export type ArticleLicense = import('@/types/database').ArticleLicense
  export type PeerReviewStatus = import('@/types/database').PeerReviewStatus
  export type PeerReviewRecommendation = import('@/types/database').PeerReviewRecommendation
  export type CollaborationStatus = import('@/types/database').CollaborationStatus
  export type MentorshipStatus = import('@/types/database').MentorshipStatus
  export type MeetingFrequency = import('@/types/database').MeetingFrequency
}
