import { useGlobalState } from './useGlobalState'
import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { PostPage }  from "./pages/PostPage/PostPage"
import { AdminPost }  from "./pages/Admin/AdminPost"
import { SinglePostPage } from "./pages/SinglePostPage/SinglePostPage"
import { AdminSinglePost } from "./pages/Admin/AdminSinglePost"
import { AuthPage } from "./pages/AuthPage/AuthPage"
import { CategoryListPage } from "./pages/CategoryListPage/CategoryListPage"
import { AdminCategory } from "./pages/Admin/AdminCategory"
import { AdminUser } from "./pages/Admin/AdminUser"
import { AdminLog } from "./pages/Admin/AdminLog"
import { AboutPage } from "./pages/AboutPage"
// import {TextGooey} from "./pages/TextGooey/TextGooey"
// import {MenuStyle2} from "./pages/MenuStyle/MenuStyle2"
// import {Morph} from "./pages/Morph/Morph"
// import { BubbleComponent } from "./pages/Bubble4"
import { CardStack as LandingPage } from "./pages/CardStack/CardStack"
// import { AppBubble } from "./pages/AppBubble"
import { InvalidLinkPage } from './pages/AuthPage/InvalidLinkPage/InvalidLinkPage'
import { AdminLogin } from './pages/Admin/AdminLogin'

export const useRoutes = () => {
  // const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [isAuthenticated, setIsAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin, setIsAdmin] = useGlobalState('isAdmin')   
 
  if (isAuthenticated && !isAdmin) {
    return (
      <Routes>       
        <Route path="/" element={<CategoryListPage />} />
        <Route path="/posts/:id" element={<PostPage />} />        
        <Route path="/post/:id" element={<SinglePostPage />} />               
        <Route path="/about" element={<AboutPage />} />        
        <Route path="/adminlogin" element={<AdminLogin />} />         
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  } 
  
  if (isAuthenticated && isAdmin) {
    return (     
      <Routes>                
        <Route path="/admin" element={<AdminCategory />} /> 
        <Route path="/admin/posts/:id" element={<AdminPost />} />        
        <Route path="/admin/post/:id" element={<AdminSinglePost />} />       
        <Route path="/admin/users" element={<AdminUser />} />
        {/* <Route path="/admin/user/:id" element={<AdminUser />} />   */}
        <Route path="/admin/logs" element={<AdminLog />} />      
        <Route path="/about" element={<AboutPage />} />          
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      {/* <Route path="/" element={<ScreenSaver />} /> */}
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/" element={<AppBubble />} /> */}
      {/* <Route path="/" element={<BubbleComponent />} /> */}
      {/* <Route path="/" element={<MenuStyle2 />} /> */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* <Route path="/firstscreen" element={<FirstScreen />} />  */}
      <Route path="/auth/:verifi/:email/:id/:token" element={<AuthPage />} />
      <Route path="/auth/invalidpage" element={<InvalidLinkPage />} />
      {/* <Route path="*" element={<Navigate to="/auth" replace />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />      
    </Routes>
  )
}