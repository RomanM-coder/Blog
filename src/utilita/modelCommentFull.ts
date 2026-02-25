import { IUser } from './modelUser'
import { IPost } from './modelPost'

export interface ICommentFull {
  _id: string
  content: string
  createdAt: Date
  like: number
  dislike: number
  related: string | null
  user: IUser
  post: IPost
}
