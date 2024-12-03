export interface IPost {
  _id?: string|number,
  title: string,
  description: string,
  liked: boolean,
  categoryId: string|number
}