import { ISectionPost } from './modelSectionsPost'

export interface IPost {
  _id?: string
  title: string
  sections: ISectionPost[]
  favorite: number
  nofavorite: number
  views: number
  createdAt: Date
  updatedAt?: Date
  categoryId: string
  userId: string
}
