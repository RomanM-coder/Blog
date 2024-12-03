import { IPost } from "./modelPost"

export const posts: IPost[] = [
  {
    _id: "1",
    title: "Post 1",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, fugiat harum. Voluptatibus beatae corrupti nulla, qui odit mollitia doloremque rerum magni rem aut laborum, maiores officiis laboriosam hic. Ratione, voluptas?",
    liked: false,
  },
  {
    _id: "2",
    title: "Post 2",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, fugiat harum. Voluptatibus beatae corrupti nulla, qui odit mollitia doloremque rerum magni rem aut laborum, maiores officiis laboriosam hic. Ratione, voluptas?",
    liked: false,
  },
  {
    _id: "3",
    title: "Post 3",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, fugiat harum. Voluptatibus beatae corrupti nulla, qui odit mollitia doloremque rerum magni rem aut laborum, maiores officiis laboriosam hic. Ratione, voluptas?",
    liked: false,
  },
]

// db.posts.insertOne({"title":"Post 1","description":"Описание","liked":false})
// db.users.insertOne({"name":"Max","email":"m@mail.ru","password":"1111"}) 