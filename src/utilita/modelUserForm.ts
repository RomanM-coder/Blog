export interface IUserForm {
  _id?: string
  email: string
  avatar?: string
  firstName?: string
  lastName?: string
  bio?: string
  confirmed: boolean
  role: 'user' | 'admin' | 'moderator' //string
  blocked: boolean
  createdAt: Date
  lastLogin?: Date | null
  votepost: string[]
  votecomment: string[]
  commentsCount: number
  postsPublishedId: string[]
}
