import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from 'react'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { usePosts } from '../PostPage/post.hook.ts'
import { useParams } from 'react-router-dom'
import { useDebounce } from '../../utilita/useDebounce.ts'
import toast from 'react-hot-toast'
import { basicColor } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.ts'
import { SearchContext } from '../../context/SearchContext.ts'
import { SortContext } from '../../context/SortContext.ts'
import { SkeletonPostList } from '../../components/SkeletonPostList/SkeletonPostList.tsx'
import { PostList } from '../../components/PostList/PostList.tsx'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './PostPage.module.css'

interface PostPageProps {
  categoryList: ICategory[]
}

export const PostPage: React.FC<PostPageProps> = ({ categoryList }) => {
  const [selectedPost, setSelectedPost] = useState<IPostFull>({} as IPostFull)
  const [, setFavorite] = useState<number>(0)
  const [, setNoFavorite] = useState<number>(0)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)

  const [hasMore, setHasMore] = useState(true)
  const isFirst = useRef(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 3
  // const renderCount = useRef(0)

  const categoryId = useParams().id!
  const hasPostId = useParams().postId!
  const hasCommentId = useParams().commentId!
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  const { t, i18n } = useTranslation()
  const hasSubscribed = useRef(false)
  const socket = useContext(SocketContext)
  const search = useContext(SearchContext)
  const sort = useContext(SortContext)
  const condition = search.type === 'all' || search.type === 'posts'
  const debouncedInputValue = useDebounce(search.query, condition, 700) // Debounce with 500ms delay
  const currentPageRef = useRef(currentPage)
  const hasMoreRef = useRef(hasMore)
  const isFetchingRef = useRef(false) // блокировка нового запроса если выполняется старый
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null) // задержка для handleScroll
  const searchTypeRef = useRef(search.type)

  const {
    postsFull,
    setPostsFull,
    useGetPost,
    useUpdatePostComments,
    useIncreaseViewPost,
    useGetPosts,
    useGetPostsStart,
    useLikeDislikePost,
    useGetSearch,
    setSelectedCategory,
    loadingState,
  } = usePosts(
    setHasMore,
    setCurrentPage,
    setSelectedPost,
    currentPageRef,
    hasMoreRef,
    itemPerPage,
    userId,
  )

  // const headers = {
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders
  // #e53935 red darken-1/#42a5f5 blue lighten-1/#69f0ae green accent-2/#ffc107 orange

  const likeDislikePost = useCallback(
    async (
      updatePostId: string,
      updatePostLike: number,
      updatePostDislike: number,
    ) => {
      const result = await useLikeDislikePost(
        updatePostId,
        updatePostLike,
        updatePostDislike,
      )
      console.log('result=', result)
      if (result.success && result.forUserId && result.forUserId === userId) {
        myToast(t('postPage.toast.voteLike'), basicColor.green)
      } else {
        if (result.forUserId && result.forUserId === userId) {
          switch (result.message) {
            // в socket !! ----------
            case 'only once':
              // myToast(t('postPage.toast.voteOnce'), basicColor.orange)
              break
            case 'Post not found':
              myToast(t('postPage.toast.postNotFound'), basicColor.red)
              break
            // default:
            //   myToast(
            //     `${t('postPage.toast.error')}, ${result.message}`,
            //     basicColor.red
            //   )
            //   break
          }
        }
      }
    },
    [useLikeDislikePost],
  )

  const handleUseGetPosts = useCallback(
    async (categoryId: string, page: number, query?: string) => {
      console.log('handleUseGetPosts-categoryId=', categoryId)

      const result = await useGetPosts(categoryId, page, query)

      if (!result.success) {
        switch (result.message) {
          case 'Posts not found':
            // myToast(t('postPage.toast.postsNotFound'), basicColor.red)
            setHasMore(false)
            break
          case 'Category not found':
            myToast(t('postPage.toast.categoryNotFound'), basicColor.red)
            break
          default:
            myToast(
              t(`${t('postPage.toast.error')}, ${result.message}`),
              basicColor.red,
            )
            break
        }
      }
    },
    [useGetPosts],
  )

  const handleUseGetSearch = useCallback(
    async (
      categoryId: string,
      page: number,
      searchString: string, // input
      query?: string,
    ) => {
      console.log('handleUseGetPosts-categoryId=', categoryId)

      const result = await useGetSearch(categoryId, page, searchString, query)

      if (!result.success) {
        // в ендпоинте success нет!!!
        switch (result.message) {
          case 'Posts not found':
            // myToast(t('postPage.toast.postsNotFound'), basicColor.red)
            setHasMore(false)
            break
          case 'Category not found':
            myToast(t('postPage.toast.categoryNotFound'), basicColor.red)
            break
          default:
            myToast(
              t(`${t('postPage.toast.error')}, ${result.message}`),
              basicColor.red,
            )
            break
        }
      }
    },
    [useGetPosts],
  )

  const handleUseGetPost = useCallback(
    async (
      postId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: IPostFull[]
    }> => {
      const result = await useGetPost(postId)

      if (!result.success) {
        switch (result.message) {
          case 'Incorrect Post ID format':
            myToast(t('postPage.toast.incorrectPostID'), basicColor.red)
            break
          case 'RuPost not found':
            myToast(t('postPage.toast.ruPostNotFound'), basicColor.red)
            break
          default:
            myToast(
              `${t('postPage.toast.error')}, ${result.message}`,
              basicColor.red,
            )
        }
      }
      return result
    },
    [useGetPost],
  )

  const handleUseUpdatePostComments = useCallback(
    async (
      postId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: IPostFull[]
    }> => {
      const result = await useUpdatePostComments(postId)

      if (!result.success) {
        switch (result.message) {
          case 'Incorrect Post ID format':
            myToast(t('postPage.toast.incorrectPostID'), basicColor.red)
            break
          case 'RuPost not found':
            myToast(t('postPage.toast.ruPostNotFound'), basicColor.red)
            break
          default:
            myToast(
              `${t('postPage.toast.error')}, ${result.message}`,
              basicColor.red,
            )
        }
      }
      return result
    },
    [useUpdatePostComments],
  )

  const handleUseGetPost_AfterAddNewComment = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    handleUseUpdatePostComments(hasPostId)
  }

  const handleIncreaseViewPost = async (updatePostId: string) => {
    console.log('🟡 Fake function called')
    await useIncreaseViewPost(updatePostId)
  }

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  // Функция для состояния ошибки
  const renderErrorState = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>{t('postPage.errorLoading')}</h3>
      <p>{t('postPage.refreshingPage')}</p>
      <button onClick={() => window.location.reload()}>
        {t('postPage.refresh')}
      </button>
    </div>
  )

  function listPostEmpty() {
    return <h3 style={{ textAlign: 'center' }}>{t('postPage.noPost')}</h3>
  }

  // Основная функция рендеринга
  const renderContent = () => {
    switch (loadingState) {
      case 'loading':
        return <SkeletonPostList />
      case 'empty':
        return listPostEmpty()
      case 'error':
        return renderErrorState()
      case 'loaded':
        return (
          <PostList
            postsFull={postsFull}
            setFavorite={setFavorite}
            setNoFavorite={setNoFavorite}
            likeDislikePost={likeDislikePost}
            handleIncreaseViewPost={handleIncreaseViewPost}
            // handleSelectPost={handleSelectPost}
            // categoryId={categoryId}
            hasPostId={hasPostId}
            hasCommentId={hasCommentId}
            activeCommentId={activeCommentId!}
            setActiveCommentId={setActiveCommentId}
            handleUseGetPost_AfterAddNewComment={
              handleUseGetPost_AfterAddNewComment
            }
            categoryList={categoryList}
          />
        )
      default:
        return null
    }
  }

  // useEffect(() => {
  //   renderCount.current += 1
  //   console.log(`🔄 PostPage render #${renderCount.current} at ${Date.now()}`)
  // }, [])

  // Используем refs для изменяющихся значений
  // const currentPageRef = useRef(currentPage)
  const categoryIdRef = useRef(categoryId)
  const sortRef = useRef(sort.sortType)
  // const hasMoreRef = useRef(hasMore)
  const hasPostIdRef = useRef(hasPostId)
  const hasCommentIdRef = useRef(hasCommentId)
  const selectedPostRef = useRef(selectedPost)
  const debouncedInputValueRef = useRef(debouncedInputValue)

  // Обновляем refs при изменении значений
  useEffect(() => {
    currentPageRef.current = currentPage
    categoryIdRef.current = categoryId
    sortRef.current = sort.sortType
    hasMoreRef.current = hasMore
    hasPostIdRef.current = hasPostId
    hasCommentIdRef.current = hasCommentId
    selectedPostRef.current = selectedPost
    debouncedInputValueRef.current = debouncedInputValue
    searchTypeRef.current = search.type
  }, [
    currentPage,
    categoryId,
    sort.sortType,
    hasMore,
    hasPostId,
    hasCommentId,
    selectedPost,
    debouncedInputValue,
    search.type,
  ])

  const isLoadingRef = useRef(false) // для блокировки handleScroll для новой категории чтобы грузилось сначала не не 6 постов, а 3

  useEffect(() => {
    const loadData = async () => {
      isLoadingRef.current = true
      // Сброс состояния
      // if (isSearchMode) {
      //   // search.clearSearch() // clear search
      // } else {
      setPostsFull([])
      setCurrentPage(1) // подгрузка по скроллу
      setHasMore(true)
      // }

      try {
        if (
          debouncedInputValueRef.current.trim() !== '' &&
          search.type !== 'comments'
          //  && categoryIdRef.current
        ) {
          // Поиск  // endpoint search
          await handleUseGetSearch(
            categoryIdRef.current,
            1,
            debouncedInputValue.trim(),
            sort.sortType,
          )
        } else {
          // Запрос первой страницы
          if (hasPostIdRef.current && hasCommentIdRef.current) {
            await handleUseGetPost(hasPostIdRef.current)
            setSelectedCategory({} as ICategory)
            await useGetPostsStart(1, sort.sortType)
          } else if (hasPostIdRef.current && !hasCommentIdRef.current) {
            const result = await handleUseGetPost(hasPostIdRef.current)
            if (result.success) {
              console.log('🔍 Result data structure:', {
                hasData: !!result.data,
                dataType: typeof result.data,
                isArray: Array.isArray(result.data),
                dataLength: result.data?.length,
                firstItem: result.data?.[0],
                firstItemType: typeof result.data?.[0],
              })
            }
            if (result.success && result.data && result.data[0]?.categoryId) {
              const categoryId = result.data[0].categoryId
              console.log('categoryId=', categoryId)

              await handleUseGetPosts(categoryId, 1)
            }
          } else {
            if (categoryIdRef.current) {
              await handleUseGetPosts(categoryIdRef.current, 1, sort.sortType)
            } else {
              await useGetPostsStart(1, sort.sortType)
            }
          }
        }
      } finally {
        isLoadingRef.current = false
      }
    }
    loadData()
  }, [
    categoryId,
    sort.sortType,
    hasPostId,
    hasCommentId,
    i18n.language,
    debouncedInputValue,
    search.type,
  ])

  const rafIdRef = useRef<number | undefined>(undefined) // number RAF

  const handleScroll = useCallback(() => {
    // Если уже идет загрузка - игнорируем все события скролла
    if (isFetchingRef.current) {
      return
    }
    // Очищаем предыдущий таймер
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current)
    }
    // Устанавливаем новый таймер
    scrollTimerRef.current = setTimeout(() => {
      // Пропускаем выполнение первый раз и ещё раз проверяем
      if (
        rafIdRef.current ||
        isFirst.current ||
        !hasMoreRef.current ||
        isLoadingRef.current ||
        isFetchingRef.current
      )
        return

      rafIdRef.current = requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = window.innerHeight

        if (scrollTop + clientHeight >= scrollHeight - 100) {
          // Загружаем следующую страницу
          const nextPage = currentPageRef.current + 1

          // Блокируем новые запросы
          isFetchingRef.current = true

          const loadData = async () => {
            try {
              if (
                debouncedInputValueRef.current.trim() !== '' &&
                search.type !== 'comments'
                //  && categoryIdRef.current
              ) {
                // Подгрузка результатов поиска
                await handleUseGetSearch(
                  categoryIdRef.current,
                  nextPage,
                  debouncedInputValueRef.current.trim(),
                  sortRef.current,
                )
              } else {
                // обычная загрузка
                const categoryIdToUse =
                  categoryIdRef.current ||
                  (hasPostIdRef.current && !hasCommentIdRef.current
                    ? selectedPostRef.current?.categoryId
                    : undefined)

                if (categoryIdToUse) {
                  await handleUseGetPosts(
                    categoryIdToUse,
                    nextPage,
                    sortRef.current,
                  )
                } else {
                  await useGetPostsStart(nextPage, sortRef.current)
                }
              }
            } catch (error) {
              console.error('Ошибка загрузки:', error)
            } finally {
              // ✅ Разблокировка
              isFetchingRef.current = false
            }
          }
          loadData()
        }
        rafIdRef.current = undefined
      })
    }, 150) // Задержка 150ms
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    // После первого раза снимаем флаг
    if (isFirst.current) {
      isFirst.current = false
    }
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current)
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    if (!socket || hasSubscribed.current) return
    hasSubscribed.current = true

    socket.emit('joinRoom', { room: 'posts', userId })
    console.log('Socket is initialized room posts')

    const handleServerEditPost = (data: {
      messageKey: string
      forUserId?: string // опциональное поле
    }) => {
      console.log('server_edit_post_response: ', data.messageKey)
      if (!data.forUserId || data.forUserId === userId)
        myToast(t(data.messageKey), basicColor.orange)
    }

    // socket.on('server_edit_post_response', (data) => {
    //   console.log('server_edit_post_response: ', data.messages)
    //   const translatedMessage = data.messages[i18n.language]
    //   setMessage(translatedMessage)
    //   myToast(translatedMessage, basicColor.orange)
    // })

    socket.on('server_edit_post_response', handleServerEditPost)

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    return () => {
      hasSubscribed.current = false
      // remove Event Listener
      socket.emit('leaveRoom', { room: 'posts', userId })
      socket.off('server_edit_post_response', handleServerEditPost)
      socket.off('connect_error')
    }
  }, [socket, userId])

  return (
    <div className={styles.subsite_feed}>
      <div className={styles.subsite_feed_sorting}>
        <div className={styles.subsite_feed_content}>
          <div className={styles.content_list}>{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
