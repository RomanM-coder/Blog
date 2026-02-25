import { useEffect, useState, useContext, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import { AddEditPostForm } from '../AddEditPostForm/AddEditPostForm.tsx'
import { AddEditCommentForm } from '../AddEditCommentForm/AddEditCommentForm.tsx'
import { DeleteForm } from '../DeleteForm/DeleteForm.tsx'
import { DeleteAllCommentForm } from '../DeleteForm/DeleteAllCommentForm.tsx'
import { AdminComment } from '../../../components/AdminComment/AdminComment.tsx'
import { AdminBlogPostForSinglePost } from '../../../components/AdminBlogPostForSinglePost/AdminBlogPostForSinglePost.tsx'
import { handleApiError } from '../../../utilita/errorHandler.ts'
import { useAdminSingle } from './adminSinglePost.hook.ts'
import { useNavigate, useParams } from 'react-router-dom'
import useScreenSize from '../../../utilita/useScreenSize.ts'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { IUser } from '../../../utilita/modelUser.ts'
import { ICommentForm } from '../../../utilita/modelCommentForm.ts'
import { ICommentFull } from '../../../utilita/modelCommentFull.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import toast from 'react-hot-toast'
import pencil from '../../../assets/static/pencil-fill.svg'
import basket from '../../../assets/static/trash-bin-sharp.svg'
import plus from '../../../assets/static/plus.svg'
import { useTranslation } from 'react-i18next'
import { SearchContext } from '../../../context/SearchContext.ts'
import { SortContext } from '../../../context/SortContext.ts'
import { SocketContext } from '../../../context/SocketContext.ts'
import { useDebounce } from '../../../utilita/useDebounce.ts'
import { basicColor } from '../../../utilita/default.ts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminSinglePost.module.css'

interface IUpdatedComment {
  _id: string
  like: number
  dislike: number
}

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

export const AdminSinglePost: React.FC = () => {
  // forms AddEdit and Delete
  const [showAddEditPostForm, setShowAddEditPostForm] = useState<boolean>(false)
  const [showDeletePostForm, setShowDeletePostForm] = useState<boolean>(false)
  const [showAddEditCommentForm, setShowAddEditCommentForm] =
    useState<boolean>(false)
  const [showDeleteCommentForm, setShowDeleteCommentForm] =
    useState<boolean>(false)
  const [showDeleteAllCommentForm, setShowDeleteAllCommentForm] =
    useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<ICommentFull>(
    {} as ICommentFull,
  )
  const [modePost, setModePost] = useState<'add' | 'edit'>('add')
  const [modeComment, setModeComment] = useState<'add' | 'edit'>('add')

  const search = useContext(SearchContext)
  const debouncedInputValue = useDebounce(search.query, true, 300) // Debounce with 300ms delay
  const sort = useContext(SortContext)

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const itemPerPage = 3

  const { t, i18n } = useTranslation()
  const userId: string = JSON.parse(localStorage.getItem('userData')!)
    .userId as string
  const navigate = useNavigate()
  const postId = useParams().id
  const socket = useContext(SocketContext)
  const renderCount = useRef(0)

  const { width = 0 } = useScreenSize()
  // const [maxWidth, setMaxWidth] = useState(0)

  useEffect(() => {
    renderCount.current += 1
    console.log(
      `🔄 AdminSinglePost render #${renderCount.current} at ${Date.now()}`,
    )
  }, [])

  console.log('=== RENDER AdminSinglePost ===')
  console.log(
    'socket:',
    socket ? `id:${socket.id}, connected:${socket.connected}` : 'null',
  )
  console.log('userId:', userId!)

  const {
    categoryId,
    selectedPost,
    setSelectedPost,
    comments,
    useGetPost,
    useLikePost,
    useLikeDislikeComment,
    useGetCommentsPagination,
    useGetCommentsSearch,
    useAddNewComment,
    useEditBlogPost,
    useDeletePost,
    useDeleteAllCommentPost,
    useDeleteComment,
    useEditComment,
    useGetFieldTranslationPost,
    useGetFieldTranslationComment,
    extendedSelectedPost,
    extendedSelectedComment,
    loadingState,
    countComments,
  } = useAdminSingle(userId!, setPageCount, itemPerPage, userId)

  // const prevCurrentPageRef = useRef<number | null>(null)
  // const prevCommentsLengthRef = useRef<number | null>(null)
  // const prevLanguageRef = useRef(i18n.language)

  const likeDislikePost = async (updatedPost: IUpdatedPost) => {
    const result = await useLikePost(updatedPost)
    console.log('result=', result)

    if (result.success) {
      if (result.forUserId && result.forUserId === userId)
        myToast(t('adminSinglePost.toast.voteLike'), basicColor.green)
    } else {
      if (result.forUserId && result.forUserId === userId) {
        if (result.typeError === 'noCatch') {
          if (result.message === 'Post not found') {
            myToast(t('adminSinglePost.toast.postNotFound'), basicColor.red)
          } else if (result.message === 'User not found') {
            myToast(t('adminSinglePost.toast.userNotFound'), basicColor.red)
          }
        } else handleApiError(result, t)
      }
    }
  }

  // пустая болванка чтобы был пропс на AddEditPostForm
  const addBlogPost = async () => {}

  const editBlogPost = async (updateBlogPost: FormData) => {
    setShowAddEditPostForm(false)

    const result = await useEditBlogPost(updateBlogPost)

    if (result.success) {
      myToast(t('adminSinglePost.toast.editPost'), basicColor.green)
    } else {
      if (result.typeError === 'noCatch') {
        if (result.message === 'Post not found') {
          myToast(t('adminSinglePost.toast.postNotFound'), basicColor.red)
        } else {
          myToast(result.message, basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const deletePost = async (
    item: ICategory | IPostFull | ICommentFull | IUser,
  ) => {
    const post = item as IPostFull
    if (post as IPostFull) {
      const result = await useDeletePost(post)

      if (result.success) {
        myToast(t('adminSinglePost.toast.deletePost'), basicColor.green)
        navigate(`/admin/posts/${result.data.categoryId}`)
      } else {
        if (result.typeError === 'noCatch') {
          if (result.message === 'Post not found') {
            myToast(t('adminSinglePost.toast.postNotFound'), basicColor.red)
          } else {
            myToast(result.message, basicColor.red)
          }
        } else handleApiError(result, t)
      }
    }
  }

  const likeDislikeComment = async (updatedComment: IUpdatedComment) => {
    const result = await useLikeDislikeComment(updatedComment)
    console.log('result=', result)

    if (result.success) {
      myToast(t('adminSinglePost.toast.voteLike'), basicColor.green)
    } else {
      if (result.typeError === 'noCatch') {
        if (result.message === 'Comment not found') {
          myToast(t('adminSinglePost.toast.commentNotFound'), basicColor.red)
        } else if (result.message === 'User not found') {
          myToast(t('adminSinglePost.toast.userNotFound'), basicColor.red)
        } else if (result.message === 'vote once') {
          // в socket !! ----------
          // myToast(t('postPage.toast.voteOnce'), basicColor.orange)
        }
      } else handleApiError(result, t)
    }
  }

  const addNewComment = async (newComment: ICommentForm) => {
    setShowAddEditCommentForm(false)

    const result = await useAddNewComment(newComment, postId!)
    if (result.success) {
      myToast(t('adminSinglePost.toast.addComment'), basicColor.green)
    } else {
      if (result.typeError === 'noCatch') {
        // Ошибки бизнес-логики с сервера (success: false в теле ответа)
        if (result.message === 'Post not found') {
          myToast(t('adminSinglePost.toast.postNotFound'), basicColor.red)
        } else if (result.message === 'User not found') {
          myToast(t('adminSinglePost.toast.userNotFound'), basicColor.red)
        } else {
          // Другие ошибки бизнес-логики
          myToast(result.message, basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const editComment = async (
    updateComment: ICommentForm,
    commentId: string,
  ) => {
    setShowAddEditPostForm(false)
    // console.log('editComment-updateComment=', updateComment)
    // console.log('editComment-commentId=', commentId)
    // console.log('editComment-adminId=', adminId)

    const result = await useEditComment(updateComment, commentId)

    if (result.success) {
      myToast(t('adminSinglePost.toast.editComment'), basicColor.green)
    } else {
      if (result.typeError === 'noCatch') {
        // Ошибки бизнес-логики с сервера (success: false в теле ответа)
        if (result.message === 'error') {
          myToast(t('adminSinglePost.toast.error'), basicColor.red)
        } else {
          // Другие ошибки бизнес-логики
          myToast(result.message, basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const deleteAllCommentPost = async (post: IPostFull) => {
    const result = await useDeleteAllCommentPost(
      post,
      sort.sortType,
      currentPage,
    )

    if (result.success) {
      myToast(t('adminSinglePost.toast.detetedAllComments'), basicColor.green)
    } else {
      if (result.typeError === 'noCatch') {
        // Ошибки бизнес-логики с сервера (success: false в теле ответа)
        if (result.message === 'Comments not found') {
          myToast(t('adminSinglePost.toast.commentsNotFound'), basicColor.red)
        } else {
          // Другие ошибки бизнес-логики
          myToast(result.message, basicColor.red)
        }
      } else handleApiError(result, t)
    }
  }

  const deleteComment = async (
    item: ICategory | IPostFull | ICommentFull | IUser,
  ) => {
    const comment = item as ICommentFull
    if (comment as ICommentFull) {
      const result = await useDeleteComment(comment, sort.sortType, currentPage)

      if (result.success) {
        myToast(t('adminSinglePost.toast.deteteComment'), basicColor.green)
      } else {
        if (result.typeError === 'noCatch') {
          // Ошибки бизнес-логики с сервера (success: false в теле ответа)
          if (result.message === 'Comment not found') {
            myToast(t('adminSinglePost.toast.commentNotFound'), basicColor.red)
          } else {
            // Другие ошибки бизнес-логики
            myToast(result.message, basicColor.red)
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

  const handleAddEditPostFormHide = () => {
    setShowAddEditPostForm(false)
  }

  const handleDeleteAllCommentFormHide = () => {
    setShowDeleteAllCommentForm(false)
  }

  const handleAddEditCommentFormHide = () => {
    setShowAddEditCommentForm(false)
  }

  const handleAddEditCommentFormShow = () => {
    setShowAddEditCommentForm(true)
  }

  const handleEditPost = async () => {
    setSelectedPost(selectedPost)
    await useGetFieldTranslationPost(selectedPost._id)
    setModePost('edit')
    setShowAddEditPostForm(true)
  }

  const handleAddComment = () => {
    setModeComment('add')
    setShowAddEditCommentForm(true)
  }

  const handleDeleteAllComment = () => {
    setShowDeleteAllCommentForm(true)
  }

  const handleDeletePost = () => {
    setSelectedPost(selectedPost)
    setShowDeletePostForm(true)
  }

  const handleDeletePostFormHide = () => {
    setShowDeletePostForm(false)
  }

  const handleDeleteCommentFormHide = () => {
    setShowDeleteCommentForm(false)
  }

  const handleDeleteCommentFormShow = () => {
    setShowDeleteCommentForm(true)
  }

  const handleLikeDislikePost = async (updatedPost: IUpdatedPost) => {
    await likeDislikePost(updatedPost)
  }

  const handleLikeDislikeComment = async (updatedComment: IUpdatedComment) => {
    await likeDislikeComment(updatedComment)
  }

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderGetComments = () => {
    const content = {
      loading: Array.from({ length: itemPerPage }).map((_, index) => (
        <Skeleton
          key={`skeletonComment-${index}`}
          width={width - 50}
          height={350}
          style={{ margin: '5px 0', borderRadius: '8px' }}
        />
      )),
      empty: (
        <h3 style={{ textAlign: 'center' }}>{t('adminSinglePost.noPost')}</h3>
      ),
      error: renderErrorState(),
      loaded: (
        <>
          {comments.map((comment: ICommentFull) => {
            return (
              <div key={comment._id}>
                <AdminComment
                  comment={comment}
                  setMode={setModeComment}
                  handleLikeDislikeComment={handleLikeDislikeComment}
                  setSelectedComment={setSelectedComment}
                  useGetFieldTranslationComment={useGetFieldTranslationComment}
                  handleAddEditCommentFormShow={handleAddEditCommentFormShow}
                  handleDeleteCommentFormShow={handleDeleteCommentFormShow}
                />
              </div>
            )
          })}
        </>
      ),
    }

    return (
      <div className={styles.commentsList}>
        {content[loadingState as LoadingState] || null}
      </div>
    )
  }

  const renderGetPost = () => {
    const content = {
      loading: (
        <Skeleton
          width={width - 50}
          height={350}
          style={{ margin: '5px 0', borderRadius: '8px' }}
        />
      ),
      empty: (
        <h3 style={{ textAlign: 'center' }}>{t('adminSinglePost.noPost')}</h3>
      ),
      error: renderErrorState(),
      loaded: (
        <AdminBlogPostForSinglePost
          post={selectedPost}
          handleLikeDislikePost={handleLikeDislikePost}
        />
      ),
    }

    return (
      <div className={styles.allPosts}>
        {content[loadingState as LoadingState] || null}
      </div>
    )
  }

  function renderErrorState() {
    return (
      <h3 style={{ textAlign: 'center' }}>
        {t('adminSinglePost.toast.error')}
      </h3>
    )
  }

  const handlePageClick = async (data: { selected: number }) => {
    console.log('data.selected', data.selected)
    setCurrentPage(data.selected)

    if (search.query) {
      await useGetCommentsSearch(
        debouncedInputValue,
        postId!,
        sort.sortType,
        data.selected,
      )
    } else {
      await useGetCommentsPagination(postId!, sort.sortType, data.selected)
    }
  }

  useEffect(() => {
    //  Только если язык РЕАЛЬНО изменился
    // if (prevLanguageRef.current !== i18n.language) {
    //   console.log(
    //     '🌐 Язык изменился:',
    //     prevLanguageRef.current,
    //     '→',
    //     i18n.language
    //   )
    if (postId) {
      const load = async () => {
        await useGetPost(postId!)
        await useGetCommentsPagination(postId!, sort.sortType, 0)
      }

      load()
      console.log('useEffect- i18n.language')
    }
    //   prevLanguageRef.current = i18n.language
    // }
  }, [i18n.language])

  useEffect(() => {
    const loadSearch = async () => {
      await useGetCommentsSearch(debouncedInputValue, postId!, sort.sortType, 0)
      setCurrentPage(0)
    }
    const loadComments = async () => {
      await useGetCommentsPagination(postId!, sort.sortType, 0)
      setCurrentPage(0)
    }
    console.log('search.query=', search.query)

    if (search.query) {
      loadSearch()
    } else loadComments()
  }, [debouncedInputValue])

  // 1. Сохраните актуальные значения в ref'ы
  const socketRef = useRef(socket)
  const userIdRef = useRef(userId)
  const tRef = useRef(t)

  // Синхронизируем ref'ы
  useEffect(() => {
    socketRef.current = socket
    userIdRef.current = userId
    tRef.current = t
  }, [
    likeDislikeComment,
    likeDislikePost,
    // mountId.current
  ])

  // useEffect(() => {
  //   if (width > 0) {
  //     setMaxWidth(width)
  //   }
  // }, [width])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !userIdRef.current) return

    console.log('🔌 AdminSinglePost: mount → join room')

    const handleEditPost = (data: {
      messageKey: string
      forUserId: string
    }) => {
      if (!data.forUserId || data.forUserId === userId)
        myToast(tRef.current(data.messageKey), basicColor.orange)
    }

    const handleEditComment = (data: {
      messageKey: string
      forUserId: string
    }) => {
      if (!data.forUserId || data.forUserId === userId)
        myToast(tRef.current(data.messageKey), basicColor.orange)
    }

    const handleConnect = () => {
      console.log('✅ Reconnected — joining adminSinglePost')
      socket.emit('joinRoom', {
        room: 'adminSinglePost',
        userId: userIdRef.current,
      })
    }

    // Подписка
    socket.on('server_edit_adminSinglePost_response', handleEditPost)
    socket.on('server_edit_comment_response', handleEditComment)
    socket.on('connect', handleConnect)

    // Join сейчас, если уже подключён
    if (socket.connected) {
      socket.emit('joinRoom', {
        room: 'adminSinglePost',
        userId: userIdRef.current,
      })
    }

    return () => {
      // remove Event Listener
      console.log('🧹 Очистка socket listeners для adminSinglePost')

      if (socket.connected && userIdRef.current) {
        socket.emit('leaveRoom', {
          room: 'adminSinglePost',
          userId: userIdRef.current,
        })
      }
      socket.off('server_edit_adminSinglePost_response', handleEditPost)
      socket.off('server_edit_comment_response', handleEditComment)
      socket.off('connect', handleConnect)
      // socket.off('connect_error', handleConnectError)
    }
  }, [likeDislikeComment, likeDislikePost])

  return (
    <>
      <div className={styles.singlePostPage}>
        <div>
          {showAddEditPostForm && (
            <AddEditPostForm
              handleAddEditPostFormHide={handleAddEditPostFormHide}
              modePost={modePost}
              extendedSelectedPost={extendedSelectedPost}
              addBlogPost={addBlogPost}
              editBlogPost={editBlogPost}
              categoryId={categoryId}
            />
          )}
          {showDeletePostForm && (
            <DeleteForm
              type={'post'}
              handleDeleteFormHide={handleDeletePostFormHide}
              selectedItem={selectedPost}
              onDelete={deletePost}
            />
          )}
          {showDeleteAllCommentForm && (
            <DeleteAllCommentForm
              handleDeleteAllCommentFormHide={handleDeleteAllCommentFormHide}
              selectedPost={selectedPost}
              deleteAllCommentPost={deleteAllCommentPost}
            />
          )}
          {showAddEditCommentForm && (
            <AddEditCommentForm
              handleAddEditCommentFormHide={handleAddEditCommentFormHide}
              modeComment={modeComment}
              extendedSelectedComment={extendedSelectedComment}
              addNewComment={addNewComment}
              editComment={editComment}
              postId={postId!}
            />
          )}
          {showDeleteCommentForm && (
            <DeleteForm
              type={'comment'}
              handleDeleteFormHide={handleDeleteCommentFormHide}
              selectedItem={selectedComment}
              onDelete={deleteComment}
            />
          )}

          <div className={styles.postWrapper}>
            <div className={styles.headerWrapper}>
              {renderGetPost()}
              {loadingState === 'loaded' && (
                <div className={styles.containerAction}>
                  <button
                    className={styles.deleteButton}
                    onClick={handleEditPost}
                  >
                    <div className={styles.wrapperPencil}>
                      <img src={pencil} width={20} height={20} loading="lazy" />
                    </div>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleDeletePost}
                  >
                    <img src={basket} width={24} height={24} loading="lazy" />
                  </button>
                  <div className={styles.deleteAllComment}>
                    <button
                      className={styles.deleteAllButton}
                      onClick={handleDeleteAllComment}
                    >
                      <img src={basket} width={24} height={24} loading="lazy" />
                      <p style={{ fontSize: '10px' }}>
                        {t('adminSinglePost.deleteAllComments')}
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.comments}>
          <div className={styles.headerComments}>
            <h3 className={styles.titleComents}>
              {countComments} {t('adminSinglePost.header')}
            </h3>

            <button className={styles.addButton} onClick={handleAddComment}>
              <img src={plus} width={24} height={24} loading="lazy" />
            </button>
          </div>

          {renderGetComments()}
        </div>
      </div>
      {/* {comments.length > itemPerPage ? ( */}
      {countComments > itemPerPage && (
        <div className={styles.paginationContainer}>
          <ReactPaginate
            breakLabel="..."
            nextLabel={t('catList.next')}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={t('catList.prev')}
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
            forcePage={currentPage}
          />
        </div>
      )}
    </>
  )
}
