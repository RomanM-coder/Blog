import React, { useEffect, useRef, useContext, useCallback } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { SaidbarLeft } from '../../components/SidebarLeft/SidebarLeft.tsx'
import { PostPage } from '../../pages/PostPage/PostPage.tsx'
import { SidebarRight } from '../../pages/SidebarRight/SidebarRight.tsx'
import { useCategoryes } from './category.hook.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.ts'
import styles from './CategoryListPage.module.css'

export const CategoryListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useGlobalState('selectedCategory')
  const [countPosts] = useGlobalState('countPosts')
  const { t, i18n } = useTranslation()

  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  const { id: categoryId } = useParams()
  // const renderCount = useRef(0)

  const socket = useContext(SocketContext)
  const hasSubscribed = useRef(false)

  const {
    useGetSelectedCategory,
    useGetCategoryForNavBar,
    useGetUserEmailConfirm,
    categoryList,
    loadingState,
  } = useCategoryes()

  const handleUseGetCategoryForNavBar = useCallback(async () => {
    const result = await useGetCategoryForNavBar()

    if (!result.success) {
      switch (result.message) {
        default:
          myToast(
            `${t('postPage.toast.error')}, ${result.message}`,
            basicColor.red,
          )
      }
    }
  }, [useGetCategoryForNavBar])

  const handleUseGetSelectedCategory = useCallback(
    async (categoryId: string) => {
      const result = await useGetSelectedCategory(categoryId)

      if (!result.success) {
        switch (result.message) {
          case 'Category not found':
            myToast(t('postPage.toast.categoryNotFound'), basicColor.red)
            break
          default:
            myToast(
              `${t('postPage.toast.error')}, ${result.message}`,
              basicColor.red,
            )
        }
      }
    },
    [useGetSelectedCategory],
  )

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  // useEffect(() => {
  //   renderCount.current += 1
  //   console.log(
  //     `🔄 CategoryListPage render #${renderCount.current} at ${Date.now()}`,
  //   )
  // })

  const postsOpacity = 1
  const pointerEvents = 'auto' as React.CSSProperties['pointerEvents']

  useEffect(() => {
    // setActivePage(0)

    if (categoryId && categoryId.trim() !== '') {
      handleUseGetSelectedCategory(categoryId)
    } else setSelectedCategory({} as ICategory)
  }, [categoryId])

  // useEffect(() => {
  //   setActivePage(0)
  // }, [])

  // useEffect(() => {
  //   handleUseGetCountPosts(categoryId!, search.query, sort.sortType, postId!)
  // }, [categoryId, search.query, sort.sortType])

  interface JoinData {
    room: string
    userId: string
  }

  useEffect(() => {
    if (!socket || hasSubscribed.current) return
    hasSubscribed.current = true

    socket.on('connect', () => {
      socket.emit('joinRoom', { room: 'categories', userId } as JoinData)
      console.log('Socket is initialized room categories')
      console.log('Socket userId=', userId)
    })

    const handleServerEditCategory = (data: {
      messages: {
        en: string
        ru: string
      }
    }) => {
      console.log('server_edit_category_response: ', data.messages)
      const translatedMessage = data.messages[i18n.language as 'en' | 'ru']
      myToast(translatedMessage, basicColor.green)
    }

    // socket.on('server_edit_response', (data) => {
    //   console.log('server_edit_response: ', data.messages)
    //   const translatedMessage = data.messages[i18n.language]
    //   setMessage(translatedMessage)
    //   myToast(translatedMessage, basicColor.green)
    // })
    socket.on('server_edit_category_response', handleServerEditCategory)

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    return () => {
      hasSubscribed.current = false
      // remove Event Listener
      socket.emit('leaveRoom', { room: 'categories', userId })
      socket.off('server_edit_category_response', handleServerEditCategory)
      socket.off('connect_error')
      socket.off('connect')
    }
  }, [socket])

  useEffect(() => {
    handleUseGetCategoryForNavBar()
  }, [i18n.language])

  useEffect(() => {
    const loadDataUser = async () => {
      await useGetUserEmailConfirm()
    }

    loadDataUser()
  }, [])

  console.log('categoryId=', categoryId)

  return (
    <>
      <div
        className={styles.categoryPage}
        style={{ opacity: postsOpacity, pointerEvents: pointerEvents }}
      >
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            {/* <h2 className={styles.title}>{t('catList.header')}</h2> */}
          </div>
          <div className={styles.layout_wrapper}>
            <>
              {/* лист категорий + ... */}

              <SaidbarLeft
                categoryList={categoryList}
                loadingState={loadingState}
                // handleSelectCategory={setSelectedCategory}
              />

              {/*  посты  */}
              <div className={styles.view}>
                <div className={styles.layout_column}>
                  {selectedCategory._id ? (
                    <div className={styles.subsite_card}>
                      <div className={styles.subsite_card_cover}>
                        <div
                        // style={{
                        //   backgroundImage: `url(${basicUrl.urlDownload}?id=${selectedCategory._id})`,
                        //   backgroundPosition: 'center',
                        //   backgroundSize: 'cover',
                        //   width: '100%',
                        //   // height: '24px',
                        //   aspectRatio: '1/1',
                        //   marginRight: '12px',
                        // }}
                        ></div>
                      </div>
                      <div className={styles.subsite_card_body}>
                        <div className={styles.subsite_card_header}>
                          <img
                            className={styles.subsite_card_avatar}
                            src={`${basicUrl.urlDownload}?id=${selectedCategory._id}`}
                            alt={'avatar'}
                            loading="lazy"
                          />
                        </div>
                        <div className={styles.subsite_card_name}>
                          <h1>{selectedCategory.name}</h1>
                        </div>
                        <div className={styles.subsite_card_description}>
                          <p style={{ textAlign: 'start' }}>
                            {selectedCategory.description}
                          </p>
                        </div>
                        <div className={styles.subsite_card_footer}>
                          <div className={styles.subsite_tabs}>
                            <div className={styles.tabs}>
                              <div className={styles.headerPosts}>
                                {t('postPage.headerPosts')}
                                <div className={styles.tabs_underline}></div>
                              </div>

                              {countPosts > 0 && (
                                <div>
                                  {t('postPage.total')}{' '}
                                  {t('postPage.post', { count: countPosts })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.postCountStart}>
                      <div className={styles.tabs}>
                        <div className={styles.headerPosts}>
                          {t('postPage.headerPosts')}
                          <div className={styles.tabs_underline}></div>
                        </div>
                        {countPosts > 0 && (
                          <div>
                            {t('postPage.total')}{' '}
                            {t('postPage.post', { count: countPosts })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <PostPage />
                </div>
              </div>
              {/*  популярные комментарии  */}
              <div className={styles.sidebar_right}>
                <SidebarRight />
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  )
}
