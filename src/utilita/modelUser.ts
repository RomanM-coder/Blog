export interface IUser {
  _id: string
  email: string
  avatar: string
  firstName?: string
  lastName?: string
  bio?: string
  // password: string
  confirmed: boolean
  role: 'user' | 'admin' | 'moderator' //string
  blocked: boolean
  createdAt: Date
  lastLogin?: Date
  votepost: string[]
  votecomment: string[]
  commentsCount: number
  postsPublishedId: string[]
}
