export interface IComment {
  _id?: string,
  content: string,
  like: number,
  dislike: number,
  postId: string,
  owner: string   
}