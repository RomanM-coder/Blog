export interface IUserForm {
  _id?: string,
  email: string,
  password?: string,
  verified: boolean,
  role: string,
  block: boolean,
  // createdAt: string,
  // lastLogin?: string|undefined,
  createdAt: Date,
  lastLogin: Date|null,  
  votepost: string[],
  votecomment: string[] 
}