import React, { useEffect, useState } from 'react'
import { BlogPost } from '../../components/BlogPost/BlogPost.tsx'
import { IPost } from '../../utilita/modelPost.ts'
import { AddPostForm } from '../../components/AddForm/AddPostForm/AddPostForm.tsx'
import { EditPostForm } from '../../components/EditForm/EditPostForm/EditPostForm.tsx'
import { DeletePostForm } from '../../components/DeleteForm/DeletePostForm.tsx'
import { usePosts } from '../../hooks/post.hook.ts'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import styles from './BlogPage.module.css'

interface InputParameters {
  isLoading: boolean
  watchForLoader: (state: boolean) => void
}

export const BlogPage:React.FC<InputParameters> = (props) => {
   
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<any>()
  
  const catId = useParams().id!
  const catName = useParams().name
  
  const {posts, useGetPosts, useLikePost, useAddNewPost, useDeletePost, useEditBlogPost, error, clearError} = usePosts(props.watchForLoader)
  
  // const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders
  // #e53935 red darken-1/#42a5f5 blue lighten-1/#69f0ae green accent-2/#ffc107 orange 
  
  interface IPostAdd {
    title: string,
    description:string,
    liked: boolean,
    categoryId: string|number
  }
  const likePost =  async (updatePost: IPost) => {       
    try {
      await useLikePost(updatePost)
      myToast('Лайк изменен', basicColor.green)                     
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }   
  }

  const addNewPost = async (post: IPostAdd) => {    
    setShowAddForm(false)
    try {
      await useAddNewPost(post)
      myToast('Пост добавлен', basicColor.green)        
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }   
  }

  const editBlogPost = async (updateBlogPost: IPost) => {
    setShowEditForm(false)
    try {
      await useEditBlogPost(updateBlogPost)
      myToast('Пост изменен', basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }    
  }    

  const deletePost = async (post: IPost) => {    
    try {
      await useDeletePost(post)
      myToast('Пост удален', basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }  
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 2000,
    })
  }
  
  const handleSelectPost = (selectedPost: IPost) => {
    setSelectedPost(selectedPost)
  } 

  const handleAddFormShow = () => {       
    setShowAddForm(true)    
  }

  const handleAddFormHide = () => {       
    setShowAddForm(false)    
  }
  
  const handleEditFormShow = () => {
    setShowEditForm(true)
  }

  const handleEditFormHide = () => {
    setShowEditForm(false)
  }
  
  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }
  
  useEffect(() => {
    useGetPosts(catId)    
    // mongodb://splinter:121212@127.0.0.1:27017/test?authMechanism=DEFAULT   
  }, [])

  function listPost() {
    return (
      <div className='allPosts'>
        {posts.map((post) => {
          return (                
            <BlogPost 
              post={post}
              key={post._id}
              likedPost={() => likePost(post)}             
              handleEditFormShow={handleEditFormShow}
              handleDeleteFormShow={handleDeleteFormShow}
              handleSelectPost={() => handleSelectPost(post)}
              categoryId={catId}               
            />            
          )
        })}
      </div>
    )
  }

  function listPostEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>Постов пока нет</h3>
    )
  }  
 
  const postsOpacity = props.isLoading ? 0.5 : 1 
  const pointerEvents = props.isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]  

  return (
    <div>
      <div 
        className={styles.blogPage} 
        style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
      >
        {showAddForm && <AddPostForm 
          handleAddFormHide={handleAddFormHide}
          addNewPost={addNewPost}
          categoryId={catId}         
        />}
        {showEditForm && <EditPostForm 
          handleEditFormHide={handleEditFormHide}
          selectedPost={selectedPost}
          editBlogPost={editBlogPost}
          categoryId={catId}
        />}
        {showDeleteForm && <DeletePostForm 
          handleDeleteFormHide={handleDeleteFormHide}
          selectedPost={selectedPost}
          deletePost={deletePost}         
        />}                   
        <>       
          <div className={styles.posts}>
            <div className={styles.divAddPost}>
              <h2>Blog Page: Category {catName}</h2>
              <button className='btnBlack' onClick={handleAddFormShow}>Создать новый пост</button>
            </div>
            {(posts.length === 0) ? listPostEmpty() : listPost()}
            {props.isLoading && <CircularProgress className={styles.postLoader} />}                    
          </div>
          <Toaster />        
        </>
      </div>      
    </div>
  )
}

//--------------------------------------------
// try {
  // console.log('body: ', body);
  // if (body) {
  //   body = JSON.stringify(body)
  //   headers['Content-Type'] = 'application/json'
  // }
  // const response = await fetch('/api/link', { 'GET', null, headers })
  // const data = await response.json()

  // if (!response.ok) {
  //   throw new Error(data.message || 'Что-то пошло не так')
  // }

  // if (!response.ok) {
  //   if (response.statusText === "Unauthorized"){logout()}  
  //   throw new Error(data.message || 'Что-то пошло не так')
  // }
  // ну и конечно прописать logout в зависимостях этого useCallback