export interface IUserProfile {
  _id: string
  email: string
  avatar: string
  firstName?: string
  lastName?: string
  bio?: string
  createdAt: string
  postsCount: number
  commentsCount: number
}
