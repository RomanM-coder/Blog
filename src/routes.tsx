import { useGlobalState } from './useGlobalState'
import { Suspense } from 'react'
import { lazyWithNamedExport } from './utilita/lazyWithNamedExport'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminRoute from './components/AdminRoute/AdminRoute'
// import { AdminPost } from './pages/Admin/AdminPost/AdminPost'
const AdminPost = lazyWithNamedExport(
  () => import('./pages/Admin/AdminPost/AdminPost'),
  'AdminPost',
)
// import { AdminSinglePost } from './pages/Admin/AdminSinglePost/AdminSinglePost'
const AdminSinglePost = lazyWithNamedExport(
  () => import('./pages/Admin/AdminSinglePost/AdminSinglePost'),
  'AdminSinglePost',
)
// import { ResetPasswordForm } from './pages/AuthPage/ResetPasswordForm/ResetPasswordForm'
const ResetPasswordForm = lazyWithNamedExport(
  () => import('./pages/AuthPage/ResetPasswordForm/ResetPasswordForm'),
  'ResetPasswordForm',
)
// import { AuthPage } from './pages/AuthPage/AuthPage'
const AuthPage = lazyWithNamedExport(
  () => import('./pages/AuthPage/AuthPage'),
  'AuthPage',
)
// import { CategoryListPage } from './pages/CategoryListPage/CategoryListPage'
const CategoryListPage = lazyWithNamedExport(
  () => import('./pages/CategoryListPage/CategoryListPage'),
  'CategoryListPage',
)
// import { AdminCategory } from './pages/Admin/AdminCategory/AdminCategory'
const AdminCategory = lazyWithNamedExport(
  () => import('./pages/Admin/AdminCategory/AdminCategory'),
  'AdminCategory',
)
// import { AdminUser } from './pages/Admin/AdminUser/AdminUser'
const AdminUser = lazyWithNamedExport(
  () => import('./pages/Admin/AdminUser/AdminUser'),
  'AdminUser',
)
// import { PostPublication } from './pages/PostPublished/PostPublication'
const PostPublication = lazyWithNamedExport(
  () => import('./pages/PostPublished/PostPublication'),
  'PostPublication',
)
// import { AboutPage } from './pages/AboutPage'
const AboutPage = lazyWithNamedExport(
  () => import('./pages/AboutPage'),
  'AboutPage',
)
//import { AdminLog } from './pages/Admin/AdminLog/AdminLog'
const AdminLog = lazyWithNamedExport(
  () => import('./pages/Admin/AdminLog/AdminLog'),
  'AdminLog',
)
// import { RulesPage } from './pages/RulesPage'
const RulesPage = lazyWithNamedExport(
  () => import('./pages/RulesPage'),
  'RulesPage',
)
// import { ProfilePage } from './pages/ProfilePage/ProfilePage'
const ProfilePage = lazyWithNamedExport(
  () => import('./pages/ProfilePage/ProfilePage'),
  'ProfilePage',
)
// import { AdminProfileUser } from './pages/Admin/AdminUser/AdminProfileUser'
const AdminProfileUser = lazyWithNamedExport(
  () => import('./pages/Admin/AdminUser/AdminProfileUser'),
  'AdminProfileUser',
)
import { ScreenSaver as LandingPage } from './pages/ScreenSaver/ScreenSaver'
// import { InvalidLinkPage } from './pages/AuthPage/InvalidLinkPage/InvalidLinkPage'
const InvalidLinkPage = lazyWithNamedExport(
  () => import('./pages/AuthPage/InvalidLinkPage/InvalidLinkPage'),
  'InvalidLinkPage',
)
import { LoadingSpinner } from './pages/LoadingSpinner/LoadingSpinner'

const AppRoutes: React.FC = () => {
  const [isAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin] = useGlobalState('isAdmin')

  if (isAuthenticated && !isAdmin) {
    // user
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<CategoryListPage />} />
          <Route path="/category/:id/:query" element={<CategoryListPage />} />
          <Route path="/category/:id" element={<CategoryListPage />} />
          <Route path="/post/:postId" element={<CategoryListPage />} />
          <Route
            path="/post/:postId/:commentId"
            element={<CategoryListPage />}
          />
          <Route path="/userProfile" element={<ProfilePage />} />
          {/* <Route path="/posts/:id" element={<PostPage />} /> */}
          {/* <Route path="/post/:id" element={<SinglePostPage />} /> */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/publicationPost" element={<PostPublication />} />

          {/* Резервный маршрут (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    )
  }

  if (isAuthenticated && isAdmin) {
    // admin
    return (
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    )
  }
  //  common
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/auth/reset-password/:token"
          element={<ResetPasswordForm />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth/confirm-email/:token" element={<AuthPage />} />
        <Route path="/auth/invalidpage" element={<InvalidLinkPage />} />
        {/* <Route path="*" element={<Navigate to="/auth" replace />} /> */}
        {/* <Route path="/unsupported-browser" element={<UnsupportedBrowser />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
