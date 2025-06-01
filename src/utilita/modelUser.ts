export interface IUser {
  _id?: string,
  email: string,
  password: string,
  verified: boolean,
  role: string,
  block: boolean,
  // createdAt: string,
  // lastLogin: string,
  createdAt: Date,
  lastLogin: Date,
  votepost: string[],
  votecomment: string[],
  postId: string[] 
}