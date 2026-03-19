import React, { useEffect, useState, useContext, Suspense } from 'react'
import { useGlobalState } from '../../../useGlobalState.ts'
import { lazyWithNamedExport } from '../../../utilita/lazyWithNamedExport.ts'
import { AdminBlogPost } from '../../../components/AdminBlogPost/AdminBlogPost.tsx'
import { ReactPagination } from '../../../components/Pagination/ReactPagination.tsx'
import { handleApiError } from '../../../utilita/errorHandler.ts'
// import { AddEditPostForm } from '../AddEditPostForm/AddEditPostForm.tsx'
const AddEditPostForm = lazyWithNamedExport(
  () => import('../AddEditPostForm/AddEditPostForm.tsx'),
  'AddEditPostForm',
)
// import { DeleteForm } from '../DeleteForm/DeleteForm.tsx'
const DeleteForm = lazyWithNamedExport(
  () => import('../DeleteForm/DeleteForm.tsx'),
  'DeleteForm',
)
import { useAdminPosts } from './adminPost.hook.ts'
import { useParams } from 'react-router-dom'
import { SearchContext } from '../../../context/SearchContext.ts'
import { SortContext } from '../../../context/SortContext.ts'
import { useDebounce } from '../../../utilita/useDebounce.ts'
import toast from 'react-hot-toast'
import { basicColor } from '../../../utilita/default.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../../context/SocketContext.ts'
import Skeleton from 'react-loading-skeleton'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import { IUser } from '../../../utilita/modelUser.ts'
import { ICommentFull } from '../../../utilita/modelCommentFull.ts'
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner.tsx'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminPost.module.css'

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

export const AdminPost: React.FC = () => {
  const [, setActivePage] = useGlobalState('activePage')
  const search = useContext(SearchContext)
  const debouncedInputValue = useDebounce(search.query, true, 300) // Debounce with 300ms delay
  const sort = useContext(SortContext)

  const [showAddEditForm, setShowAddEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [modePost, setModePost] = useState<'add' | 'edit'>('add')

  const [selectedPost, setSelectedPost] = useState<IPostFull>({} as IPostFull)
  const [, setFavorite] = useState<number>(0)
  const [, setNoFavorite] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 3
  // const renderCount = useRef(0)

  const catId = useParams().id!
  const userId: string = JSON.parse(localStorage.getItem('userData')!)
    .userId as string
  const { t, i18n } = useTranslation()
  const socket = useContext(SocketContext)

  // const isFirstRender = useRef(true) // При монтаже не грузить ListCategories
  // const prevCatIdRef = useRef<string | null>(null)
  // const prevLanguageCategoryRef = useRef(i18n.language)
  // const prevLanguagePostRef = useRef<string | null>(null)

  const {
    postsFull,
    useGetPosts,
    useLikePost,
    useAddNewPost,
    useDeletePost,
    useEditBlogPost,
    useGetSearch,
    category,
    useGetFieldTranslation,
    extendedSelectedPost,
    loadingState,
    countPosts,
  } = useAdminPosts(itemPerPage)

  const likePost = async (updatePost: IUpdatedPost) => {
    const result = await useLikePost(updatePost)

    console.log('result=', result)
    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminPostPage.toast.voteLike'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError !== 'noCatch') {
          handleApiError(result, t)
        }
      }
    }
  }

  const addBlogPost = async (post: FormData) => {
    setShowAddEditForm(false)

    const result = await useAddNewPost(post, sort.sortType, 1)

    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminPostPage.toast.addPost'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError === 'noCatch') {
          if (result.message === 'Cannot create FilesDirectory')
            myToast(
              t('adminPostPage.toast.errorCreateFilesDirectory'),
              basicColor.red,
            )
          // else myToast(t(result.message), basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const editBlogPost = async (updateBlogPost: FormData) => {
    setShowAddEditForm(false)

    const result = await useEditBlogPost(
      updateBlogPost,
      sort.sortType,
      currentPage,
    )

    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminPostPage.toast.editPost'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError === 'noCatch') {
          if (result.message === 'Post not found')
            myToast(t('adminPostPage.toast.postNotFound'), basicColor.red)
          else if (result.message === 'Cannot create FilesDirectory')
            myToast(
              t('adminPostPage.toast.errorCreateFilesDirectory'),
              basicColor.red,
            )
          // else myToast(t(result.message), basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const deletePost = async (
    item: ICategory | IPostFull | ICommentFull | IUser,
    adminId: string,
  ) => {
    const post = item as IPostFull
    if (post as IPostFull) {
      const result = await useDeletePost(
        post,
        adminId,
        sort.sortType,
        currentPage,
      )

      if (result.success) {
        if (result.forUserId && result.forUserId === userId)
          myToast(t('adminPostPage.toast.deletePost'), basicColor.green)
      } else {
        if (result.forUserId && result.forUserId === userId) {
          if (result.typeError === 'noCatch') {
            if (result.message === 'Post not found')
              myToast(t('adminPostPage.toast.postNotFound'), basicColor.red)
            // else myToast(t(result.message), basicColor.red)
          }
        } else handleApiError(result, t)
      }
    }
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }

  const handleSelectPost = (selectedPost: IPostFull) => {
    // useGetFieldTranslation(selectedPost)
    setSelectedPost(selectedPost)
  }

  const handleAddEditFormShow = () => {
    setShowAddEditForm(true)
  }

  const handleAddEditFormHide = () => {
    setShowAddEditForm(false)
  }

  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderContentPostPage = () => {
    const content = {
      loading: Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={`skeletonPost-${index}`}
          width={880}
          height={350}
          style={{ margin: '5px 0', borderRadius: '8px' }}
        />
      )),
      empty: listPostEmpty(),
      error: renderErrorState(),
      loaded: postsFull.map((post) => (
        <div
          key={post._id}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AdminBlogPost
            post={post}
            setModePost={setModePost}
            setFavorite={setFavorite}
            setNoFavorite={setNoFavorite}
            likePost={likePost}
            useGetFieldTranslation={useGetFieldTranslation}
            handleAddEditFormShow={handleAddEditFormShow}
            handleDeleteFormShow={handleDeleteFormShow}
            handleSelectPost={handleSelectPost}
            categoryId={catId}
            category={category}
          />
        </div>
      )),
    }

    return (
      <div className={styles.allPosts}>
        {content[loadingState as LoadingState] || null}
      </div>
    )
  }

  function listPostEmpty() {
    return <h3 style={{ textAlign: 'center' }}>{t('adminPostPage.noPost')}</h3>
  }

  function renderErrorState() {
    return (
      <h3 style={{ textAlign: 'center' }}>{t('adminPostPage.toast.error')}</h3>
    )
  }
  // console.log('posts=', posts.length);

  const changePage = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => prev + 1)
  const prevPage = () => setCurrentPage((prev) => prev - 1)

  // const postsOpacity = isLoading ? 0.5 : 1
  // const pointerEvents = isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]

  const postsOpacity = 1
  const pointerEvents = 'auto' as React.CSSProperties['pointerEvents']

  useEffect(() => {
    // if (isFirstRender.current) return
    // // СИНХРОННО устанавливаем флаг
    // isFirstRender.current = true

    // if (
    //   prevCatIdRef.current === catId &&
    //   prevLanguagePostRef.current === i18n.language
    // )
    //   return

    // Проверяем, изменились ли параметры
    // const hasCatIdChanged = prevCatIdRef.current !== catId
    // const hasLanguageChanged = prevLanguagePostRef.current !== i18n.language

    // // Если ничего не изменилось и это не первый рендер
    // if (
    //   !hasCatIdChanged &&
    //   !hasLanguageChanged &&
    //   prevCatIdRef.current !== null
    // ) {
    //   return
    // }

    const load1 = async () => {
      await useGetPosts(catId, sort.sortType, 1)
      setActivePage(1)

      // prevCatIdRef.current = catId
      // prevLanguagePostRef.current = i18n.language
    }

    load1()

    // if (Object.keys(category).length !== 0) {
    //   const nameCategory = category.name as string
    //   console.log('nameCategory', nameCategory)
    //   setActiveSubPage(nameCategory)
    // }
    console.log('useEffect-catId, i18n.language')
  }, [catId, i18n.language])

  console.log('🔍 SEARCH.TYPE:', sort.sortType)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedInputValue])

  useEffect(() => {
    const loadSearch = async () => {
      await useGetSearch(debouncedInputValue, sort.sortType, currentPage)
    }
    const loadAllPosts = async () => {
      await useGetPosts(catId, sort.sortType, currentPage)
      setActivePage(1)
    }
    console.log('search.query=', search.query)

    if (search.query) {
      loadSearch()
    } else loadAllPosts()
  }, [debouncedInputValue, sort.sortType, currentPage])

  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket не инициализирован')
      return
    }

    console.log('🔌 AdminPosts Socket Debug:')
    console.log('Socket ID:', socket.id)
    console.log('Socket connected:', socket.connected)
    console.log('UserID:', userId)

    const handleServerEditPost = (data: {
      messageKey: string
      forUserId?: string
    }) => {
      console.log('📨 Событие получено! server_edit_adminPost_response:', data)
      console.log('messageKey:', data.messageKey, 't:', t(data.messageKey))
      if (!data.forUserId || data.forUserId === userId)
        myToast(t(data.messageKey), basicColor.orange)
    }

    socket.on('server_edit_adminPost_response', handleServerEditPost)

    // 2. Если сокет уже подключен - присоединяемся к комнате сразу
    if (socket.connected) {
      console.log('Socket уже подключен, присоединяюсь к комнате')
      socket.emit('joinRoom', { room: 'adminPosts', userId })
    }

    // 3. Обработчик подключения
    const handleConnect = () => {
      console.log(
        '✅ Socket connected, ID:',
        socket.id,
        'присоединяюсь к adminPosts',
      )
      socket.emit('joinRoom', { room: 'adminPosts', userId })
    }

    // 4. Обработчик ошибок
    const handleConnectError = (err: Error) => {
      console.error('❌ Connection error:', err.message)
    }

    // 5. Подписываемся на события
    socket.on('connect', handleConnect)
    socket.on('connect_error', handleConnectError)

    return () => {
      // remove Event Listener
      console.log('🧹 Очистка socket listeners для adminPosts')
      socket.emit('leaveRoom', { room: 'adminPosts', userId })
      socket.off('server_edit_adminPost_response', handleServerEditPost)
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)
    }
  }, [socket, userId])

  return (
    <>
      <div
        className={styles.blogPage}
        style={{ opacity: postsOpacity, pointerEvents: pointerEvents }}
      >
        {showAddEditForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEditPostForm
              handleAddEditPostFormHide={handleAddEditFormHide}
              modePost={modePost}
              extendedSelectedPost={extendedSelectedPost}
              addBlogPost={addBlogPost}
              editBlogPost={editBlogPost}
              categoryId={catId}
            />
          </Suspense>
        )}
        {showDeleteForm && (
          <Suspense fallback={<LoadingSpinner />}>
            <DeleteForm
              type={'post'}
              handleDeleteFormHide={handleDeleteFormHide}
              selectedItem={selectedPost}
              onDelete={deletePost}
            />
          </Suspense>
        )}
        <>
          <div className={styles.posts}>
            <div className={styles.divAddPost}>
              <h2 className={styles.headerPostPage}>
                {t('adminPostPage.header') + `${category?.name}`}
              </h2>
              <h4 className={styles.countPostPage}>
                {t('adminPostPage.countPosts') + `${countPosts}`}
              </h4>
              <button
                className="btnBlack"
                onClick={() => {
                  setModePost('add')
                  handleAddEditFormShow()
                }}
              >
                {t('adminPostPage.createPost')}
              </button>
            </div>

            {renderContentPostPage()}
          </div>
        </>
      </div>
      {countPosts > itemPerPage ? (
        <ReactPagination
          itemsPerPage={itemPerPage}
          allItems={countPosts}
          changePage={changePage}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      ) : null}
    </>
  )
}
