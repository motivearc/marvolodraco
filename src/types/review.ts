export type ReviewStatus = 'pending' | 'approved'

export type Review = {
  id: string
  name: string
  rating: number
  text: string
  status: ReviewStatus
  createdAt: string
}

export type ReviewDraft = {
  name: string
  rating: number
  text: string
}
