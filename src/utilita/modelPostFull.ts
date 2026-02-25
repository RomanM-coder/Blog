import { ISectionPost } from './modelSectionsPost'
import { IUser } from './modelUser'

export interface IPostFull {
  _id: string
  title: string
  sections: ISectionPost[]
  favorite: number
  nofavorite: number
  views: number
  countComments: number
  createdAt: Date
  updatedAt?: Date
  categoryId: string
  user: IUser
}
