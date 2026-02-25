import { useGlobalState } from './useGlobalState'
import AdminRoute from './components/AdminRoute/AdminRoute'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminPost } from './pages/Admin/AdminPost/AdminPost'
import { AdminSinglePost } from './pages/Admin/AdminSinglePost/AdminSinglePost'
import { AuthPage } from './pages/AuthPage/AuthPage'
import { CategoryListPage } from './pages/CategoryListPage/CategoryListPage'
import { AdminCategory } from './pages/Admin/AdminCategory/AdminCategory'
import { AdminUser } from './pages/Admin/AdminUser/AdminUser'
import { PostPublication } from './pages/PostPublished/PostPublication'
import { AboutPage } from './pages/AboutPage'
import { AdminLog } from './pages/Admin/AdminLog/AdminLog'
import { RulesPage } from './pages/RulesPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { AdminProfileUser } from './pages/Admin/AdminUser/AdminProfileUser'
import { ScreenSaver as LandingPage } from './pages/ScreenSaver/ScreenSaver'
import { InvalidLinkPage } from './pages/AuthPage/InvalidLinkPage/InvalidLinkPage'

const AppRoutes: React.FC = () => {
  const [isAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin] = useGlobalState('isAdmin')

  if (isAuthenticated && !isAdmin) {
    return (
      <Routes>
        {/* Публичные маршруты для всех */}
        <Route path="/" element={<CategoryListPage />} />
        <Route path="/category/:id/:query" element={<CategoryListPage />} />
        <Route path="/category/:id" element={<CategoryListPage />} />
        <Route path="/post/:postId" element={<CategoryListPage />} />
        <Route path="/post/:postId/:commentId" element={<CategoryListPage />} />
        <Route path="/userProfile" element={<ProfilePage />} />
        {/* <Route path="/posts/:id" element={<PostPage />} /> */}
        {/* <Route path="/post/:id" element={<SinglePostPage />} /> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/publicationPost" element={<PostPublication />} />

        {/* Резервный маршрут (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (isAuthenticated && isAdmin) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/log" element={<AdminLog />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* ЗАЩИЩЕННЫЕ АДМИН-МАРШРУТЫ - изменения, добавления, удаления */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminCategory />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/posts/:id"
          element={
            <AdminRoute>
              <AdminPost />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/post/:id"
          element={
            <AdminRoute>
              <AdminSinglePost />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <AdminRoute>
              <AdminProfileUser />
            </AdminRoute>
          }
        />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/auth/confirm-email/:token" element={<AuthPage />} />
      <Route path="/auth/invalidpage" element={<InvalidLinkPage />} />
      {/* <Route path="*" element={<Navigate to="/auth" replace />} /> */}
      {/* <Route path="/unsupported-browser" element={<UnsupportedBrowser />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
