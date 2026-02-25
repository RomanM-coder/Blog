import { IUser } from './modelUser'
import { IPost } from './modelPost'

export interface ICommentTree {
  _id: string
  content: string
  createdAt: Date
  like: number
  dislike: number
  related: ICommentTree[] | null
  user: IUser
  post: IPost
}
