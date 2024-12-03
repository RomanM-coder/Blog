import { Routes, Route, Navigate } from "react-router-dom"
import { BlogPage }  from "./pages/BlogPage/BlogPage"
import { SinglePostPage } from "./pages/SinglePostPage/SinglePostPage"
import { AuthPage } from "./pages/AuthPage/AuthPage"
import { CategoryListPage } from "./pages/CategoryListPage/CategoryListPage"
import { AboutPage } from "./pages/AboutPage"

export const useRoutes = (
  isAuthenticated: boolean, 
  isLoading: boolean, 
  watchForLoader: (childState: boolean) => void
) => {
 
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<CategoryListPage 
          watchForLoader={watchForLoader} 
          isLoading={isLoading} />} 
        />
        <Route path="/post/:id/:name" element={<BlogPage
          watchForLoader={watchForLoader} 
          isLoading={isLoading} />}         
        />                
        <Route path="/about" element={<AboutPage />} />      
        <Route path="/detail/:id" element={<SinglePostPage
          watchForLoader={watchForLoader} 
          isLoading={isLoading} />} 
        />        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />      
    </Routes>
  )

}