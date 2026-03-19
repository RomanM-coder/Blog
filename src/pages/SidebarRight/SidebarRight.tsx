import { CommentPost } from '../../components/CommentPost/CommentPost.tsx'
import { useEffect, useState, useContext, useRef, useCallback } from 'react'
import { useSidebarRight } from './sidebarRight.hook.ts'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import { useDebounce } from '../../utilita/useDebounce.ts'
import { SearchContext } from '../../context/SearchContext.ts'
import { SortContext } from '../../context/SortContext.ts'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { motion } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../SidebarRight/SidebarRight.module.css'

export const SidebarRight: React.FC = () => {
  const [comments, setComments] = useState<ICommentFull[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const currentPageRef = useRef(currentPage)
  const hasMoreRef = useRef(hasMore)

  const search = useContext(SearchContext)
  const sort = useContext(SortContext)
  const itemPerPage = 7

  const { t, i18n } = useTranslation()
  const condition = search.type === 'all' || search.type === 'comments'
  const debouncedInputValue = useDebounce(search.query, condition, 700) // Debounce with 300ms delay

  const {
    selectedPost,
    commentsCount,
    loadingState,
    useGetPopularComments,
    useGetSearch,
  } = useSidebarRight({
    setComments,
    setHasMore,
    setCurrentPage,
    currentPageRef,
    hasMoreRef,
    itemPerPage,
  })
  // const isFirst = useRef(true)
  const isFetchingRef = useRef(false) // блокировка нового запроса если выполняется старый
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null) // задержка для handleScroll
  const searchTypeRef = useRef(search.type)

  const renderErrorState = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>{t('singlePostPage.errorLoading')}</h3>
      <p>{t('singlePostPage.refreshingPage')}</p>
      <button onClick={() => window.location.reload()}>
        {t('singlePostPage.refresh')}
      </button>
    </div>
  )

  // Основная функция рендеринга
  const renderContent = () => {
    switch (loadingState) {
      case 'loading':
        return zaglushkaSkeleton()
      case 'empty':
        return getCommentNot()
      case 'error':
        return renderErrorState()
      case 'loaded':
        // case 'idle':
        return (
          <>
            {comments.map((comment: ICommentFull) => {
              return (
                <motion.div
                  key={comment._id}
                  className={styles.comment_item}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.3 }}
                  style={{ willChange: 'y', transform: 'translateZ(0)' }}
                >
                  <div className={styles.wrapperComment}>
                    <CommentPost
                      tab={'block-popularComments'}
                      comment={comment}
                    />
                  </div>
                </motion.div>
              )
            })}
          </>
        )
      default:
        return null
    }
  }

  function getCommentNot() {
    return (
      <p style={{ textAlign: 'center' }}>{t('singlePostPage.noComments')}</p>
    )
  }

  const zaglushkaSkeleton = () => {
    return Array.from({ length: itemPerPage }).map((_, index) => (
      <div
        key={`skeletonComment-${index}`}
        className={styles.notCommentWrapper}
      >
        <Skeleton
          // width={255}
          height={150}
          style={{ marginBottom: '10px', width: '100%' }}
        />
      </div>
    ))
  }

  const commentsContainerRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef(sort.sortType)
  const debouncedInputValueRef = useRef(debouncedInputValue)
  const isLoadingRef = useRef(false) // для блокировки handleScroll для новой категории чтобы грузилось сначала не не 6 постов, а 3

  // Обновляем refs при изменении значений
  useEffect(() => {
    currentPageRef.current = currentPage
    sortRef.current = sort.sortType
    hasMoreRef.current = hasMore
    debouncedInputValueRef.current = debouncedInputValue.trim()
    searchTypeRef.current = search.type
  }, [currentPage, sort.sortType, hasMore, debouncedInputValue, search.type])

  useEffect(() => {
    const loadData = async () => {
      isLoadingRef.current = true
      // Сброс состояния
      // if (isSearchMode) {
      //   // search.clearSearch() // clear search
      // } else {
      setComments([])
      setCurrentPage(1) // подгрузка по скроллу
      setHasMore(true)
      // }

      try {
        if (
          debouncedInputValue.trim() !== '' &&
          (search.type === 'comments' || search.type === 'all')
        ) {
          // Поиск  // endpoint search
          await useGetSearch(debouncedInputValue.trim(), sort.sortType, 1)
        } else {
          // Запрос первой страницы
          useGetPopularComments(1, sort.sortType)
        }
      } finally {
        isLoadingRef.current = false
      }
    }
    loadData()
  }, [sort.sortType, i18n.language, debouncedInputValue, search.type])

  const handleCommentsScroll = useCallback(() => {
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
        // isFirst.current ||
        !hasMoreRef.current ||
        isLoadingRef.current ||
        isFetchingRef.current
      )
        return

      const container = commentsContainerRef.current
      if (!container || !hasMoreRef.current) return

      // console.log('📊 Размеры контейнера:', {
      //   scrollHeight: container.scrollHeight,
      //   clientHeight: container.clientHeight,
      //   scrollTop: container.scrollTop,
      //   hasScrollbar: container.scrollHeight > container.clientHeight,
      // })

      // const { scrollTop, scrollHeight, clientHeight } = container
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // Загружаем следующую страницу
        const nextPage = currentPageRef.current + 1

        // Блокируем новые запросы
        isFetchingRef.current = true

        const loadMoreData = async () => {
          try {
            if (
              debouncedInputValueRef.current !== '' &&
              (searchTypeRef.current === 'comments' ||
                searchTypeRef.current === 'all')
            ) {
              // Подгрузка результатов поиска
              await useGetSearch(
                debouncedInputValueRef.current,
                sortRef.current,
                nextPage,
              )
            } else {
              // обычная загрузка
              await useGetPopularComments(nextPage, sortRef.current)
            }
          } catch (error) {
            console.error('Ошибка загрузки:', error)
          } finally {
            // ✅ Разблокировка
            isFetchingRef.current = false
          }
        }
        loadMoreData()
      }
    }, 150) // Задержка 150ms
  }, [])

  // Вешаем обработчик на локальный контейнер
  useEffect(() => {
    const container = commentsContainerRef.current
    if (!container) return
    container.addEventListener('scroll', handleCommentsScroll)

    // // После первого раза снимаем флаг
    // if (isFirst.current) {
    //   isFirst.current = false
    // }
    return () => {
      container.removeEventListener('scroll', handleCommentsScroll)
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }
    }
  }, [handleCommentsScroll])

  if (!selectedPost)
    return (
      <h2 style={{ textAlign: 'center' }}>
        {t('singlePostPage.toast.noPost')}
      </h2>
    )

  return (
    <div className={styles.widgets}>
      <div className={styles.widget_item}>
        <div className={styles.widget_item_title}>
          {t('singlePostPage.popularComments')}
        </div>
        <div className={styles.widget_item_count}>
          {comments.length !== 0 ? t('singlePostPage.total') : null}
          {t('singlePostPage.comment', { count: commentsCount })}
        </div>
        <div ref={commentsContainerRef} className={styles.commentsList}>
          <div className={styles.sidebarScrollContainer}>
            {comments.length > 0 && comments.length < 6 && (
              <div
                style={{
                  height: '900px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            )}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
