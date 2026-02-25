// import { AddCommentForm } from "./AddCommentForm/AddCommentForm.tsx"
import {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import { useInsertInPostList } from './insertInPostList.hook.ts'
import { CommentForm } from '../../components/CommentForm/CommentForm.tsx'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import { ICommentTree } from '../../utilita/modelCommentTree.ts'
import { IComment } from '../../utilita/modelComment.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SocketContext } from '../../context/SocketContext.ts'
import { useTranslation } from 'react-i18next'
import { basicColor } from '../../utilita/default.ts'
import Skeleton from 'react-loading-skeleton'
import { CommentList } from '../../components/CommentList/CommentList.tsx'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../InsertInPostList/InsertInPostList.module.css'

interface IInsertProps {
  hasCommentId: string
  activeCommentId: string
  setActiveCommentId: (commId: string | null) => void
  handleUseGetPost_AfterAddNewComment: () => void
}

export const InsertInPostList: React.FC<IInsertProps> = ({
  hasCommentId,
  activeCommentId,
  setActiveCommentId,
  handleUseGetPost_AfterAddNewComment,
}) => {
  const [isEmailConfirm] = useGlobalState('isEmailConfirm')
  const params = useParams()
  console.log('🔍 InsertInPostList - все параметры:', params)
  console.log('🎯 InsertInPostList - hasCommentId пропс:', hasCommentId)

  const initialShowCommentCount = 3
  const [countCommentShow, setCountCommentShow] = useState(1)

  const [, setSelectedComment] = useState<ICommentFull>({} as ICommentFull)
  const [comments, setComments] = useState<ICommentFull[]>([])
  const [commentWritgh, setCommentWritgh] = useState('')
  const hasSubscribed = useRef(false)
  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  const renderCount = useRef(0)

  // const itemPerPage = 3
  const hasPostId = useParams().postId!
  // const commId = useParams().commentId!
  const { t, i18n } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const {
    selectedPost,
    useLikeDislikeComment,
    useGetComments,
    useAddNewComment,
    useGetCommentsInsertInPostList,
    loadingState,
  } = useInsertInPostList({ setComments, idUser: userId })

  console.log('📊 InsertInPostList - loadingState:', loadingState)
  console.log('💾 InsertInPostList - comments из useState:', comments.length)

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const likeDislikeComment = useCallback(
    async (updateComment: IComment) => {
      const result = await useLikeDislikeComment(updateComment, hasCommentId)

      if (result.success && result.forUserId && result.forUserId === userId)
        myToast(t('singlePostPage.toast.changeLike'), basicColor.green)
      else {
        if (result.forUserId && result.forUserId === userId) {
          switch (result.message) {
            case 'Comment not found':
              myToast(t('singlePostPage.toast.commentNotFound'), basicColor.red)
              break
            case 'User not found':
              myToast(t('singlePostPage.toast.userNotFound'), basicColor.red)
              break
            // case 'Only once':
            // myToast(t('singlePostPage.toast.voteOnce'), basicColor.orange)
            // break
            default:
              // myToast(
              //   t(`${t('singlePostPage.toast.error')}, ${result.message}`),
              //   basicColor.red
              // )
              break
          }
        }
      }
    },
    [useLikeDislikeComment, hasCommentId],
  )

  const addNewComment = useCallback(
    async (newComment: string) => {
      const result = await useAddNewComment(
        newComment,
        activeCommentId,
        hasPostId,
        // userId,
        hasCommentId,
      )
      if (result.success)
        if (result.forUserId && result.forUserId === userId)
          myToast(t('singlePostPage.toast.addComment'), basicColor.green)
        // handleUseGetPost(hasPostId)
        else {
          if (result.forUserId && result.forUserId === userId) {
            switch (result.message) {
              default:
                myToast(
                  t(`${t('singlePostPage.toast.error')}, ${result.message}`),
                  basicColor.red,
                )
                break
            }
          }
        }
    },
    [useAddNewComment, activeCommentId, hasPostId, userId, hasCommentId],
  )

  const handleUseGetComments = useCallback(
    async (postId: string) => {
      const result = await useGetComments(postId)

      if (!result.success) {
        switch (result.message) {
          case 'Post is not found':
            myToast(t('singlePostPage.toast.postNotFound'), basicColor.red)
            break
          default:
            myToast(
              `${t('singlePostPage.toast.error')}, ${result.message}`,
              basicColor.red,
            )
        }
      }
    },
    [useGetComments],
  )

  const handleUseGetCommentsInsertInPostList = useCallback(
    async (commentId: string) => {
      const result = await useGetCommentsInsertInPostList(commentId)

      if (!result.success) {
        switch (result.message) {
          case 'Comment is not found':
            myToast(t('singlePostPage.toast.commentNotFound'), basicColor.red)
            break
          default:
            myToast(
              `${t('singlePostPage.toast.error')}, ${result.message}`,
              basicColor.red,
            )
        }
      }
    },
    [useGetCommentsInsertInPostList],
  )

  const handleLikeDislikeComment = useCallback(
    async (updatedComment: IComment) => {
      await likeDislikeComment(updatedComment)
    },
    [likeDislikeComment],
  )

  const handleSelectComment = useCallback(
    (selectedComment: ICommentFull) => {
      setSelectedComment(selectedComment)
    },
    [setSelectedComment],
  )

  const handleCloseForm = () => {
    setActiveCommentId(null)
  }

  // Функция для преобразования плоского списка в дерево
  const buildCommentTree = useCallback(
    (flatComments: ICommentFull[]): ICommentTree[] => {
      const commentMap = new Map()
      const roots: ICommentTree[] = []

      // Создаем map для быстрого доступа
      flatComments.forEach((comment) => {
        commentMap.set(comment._id, { ...comment, related: [] })
      })

      // Строим дерево
      flatComments.forEach((comment) => {
        const node = commentMap.get(comment._id)
        if (comment.related) {
          const parent = commentMap.get(comment.related)
          if (parent) {
            parent.related.push(node)
          } else {
            // Если parent не найден - делаем комментарий root
            roots.push(node)
          }
        } else {
          roots.push(node)
        }
      })

      return roots
    },
    [],
  )

  const commentsTree = useMemo(() => {
    return buildCommentTree(comments)
  }, [comments, buildCommentTree])

  const shouldShowButton = useMemo(
    () => commentsTree.length >= initialShowCommentCount,
    [commentsTree.length, initialShowCommentCount],
  )
  // comments.length > countCommentShow * initialShowCommentCount
  const showFullCommentsList = useMemo(
    () => countCommentShow * initialShowCommentCount >= commentsTree.length,
    [countCommentShow, initialShowCommentCount, commentsTree.length],
  )

  function getCommentNot() {
    return (
      <p style={{ textAlign: 'center' }}>{t('singlePostPage.noComments')}</p>
    )
  }

  const zaglushkaSkeleton = useCallback(() => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeletonComment-${index}`}
        className={styles.notCommentWrapper}
      >
        <Skeleton width={266} height={150} style={{ marginBottom: '10px' }} />
      </div>
    ))
  }, [])

  const getAllCommentsOfPost = () => {
    navigate(`/post/${hasPostId}`)
  }

  useEffect(() => {
    renderCount.current += 1
    console.log(
      `🔄 InsertInPostList render #${renderCount.current} at ${Date.now()}`,
    )
  }, [])

  // Используем refs для изменяющихся значений
  const hasPostIdRef = useRef(hasPostId)
  const hasCommentIdRef = useRef(hasCommentId)

  useEffect(() => {
    // нажали на кнопку 'Показать все комментарии' во Вставке в посты или в конкретном посте 'комментарии'
    if (hasPostIdRef.current && !hasCommentIdRef.current)
      handleUseGetComments(hasPostIdRef.current)
    // нажали на "комментарий" в блоке 'Популярные комментарии'
    if (hasCommentIdRef.current && hasPostIdRef.current)
      handleUseGetCommentsInsertInPostList(hasCommentIdRef.current)
  }, [i18n.language])

  useEffect(() => {
    if (!socket || hasSubscribed.current) return
    hasSubscribed.current = true

    socket.emit('joinRoom', { room: 'singlePost', userId })
    console.log('Socket is initialized room singlePost')

    // socket.on('server_edit_comment_response', (data) => {
    //   console.log('server_edit_comment_response: ', data.messages)
    //   const translatedMessage = data.messages[i18n.language]
    //   setMessage(translatedMessage)
    //   myToast(translatedMessage, basicColor.orange)
    // })

    const handleServerEditComment = (data: {
      messageKey: string
      forUserId?: string // опциональное поле
    }) => {
      console.log('server_edit_comment_response: ', data.messageKey)
      if (!data.forUserId || data.forUserId === userId) {
        myToast(t(data.messageKey), basicColor.orange)
      }
    }
    socket.on('server_edit_comment_response', handleServerEditComment)

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    return () => {
      hasSubscribed.current = false
      // remove Event Listener
      socket.emit('leaveRoom', { room: 'singlePost', userId })
      socket.off('server_edit_comment_response', handleServerEditComment)
      socket.off('connect_error')
    }
  }, [socket, userId])

  if (!selectedPost)
    return (
      <h2 style={{ textAlign: 'center' }}>
        {t('singlePostPage.toast.noPost')}
      </h2>
    )

  return (
    <>
      <div className={styles.widgets}>
        <div className={styles.widget_item}>
          <div className={styles.commentsList}>
            {hasCommentId && (
              <div className={styles.comment_limit_top}>
                <button
                  className={styles.link_button}
                  onClick={getAllCommentsOfPost}
                >
                  {t('singlePostPage.showAllComments')}
                </button>
              </div>
            )}
            {!hasCommentId && hasPostId && (
              <div className={styles.comment_limit_top}>
                <button className={styles.link_button_all_commtnts}>
                  {t('singlePostPage.comment', { count: comments.length })}
                </button>
              </div>
            )}
            {hasPostId &&
              !hasCommentId &&
              !activeCommentId &&
              isEmailConfirm && (
                <div className={styles.comment_content}>
                  <CommentForm
                    handleCloseForm={handleCloseForm}
                    showChild={false}
                    commentWritgh={commentWritgh}
                    setCommentWritgh={setCommentWritgh}
                    parent={false}
                    addNewComment={addNewComment}
                    handleUseGetPost_AfterAddNewComment={
                      handleUseGetPost_AfterAddNewComment
                    }
                    depth={0}
                  />
                </div>
              )}

            <>
              {loadingState === 'loading' ? (
                zaglushkaSkeleton()
              ) : loadingState === 'empty' ? (
                getCommentNot()
              ) : (
                <CommentList
                  // commentsTreeToDisplay={commentsTreeToDisplay}
                  commentsTreeToDisplay={commentsTree}
                  handleLikeDislikeComment={handleLikeDislikeComment}
                  handleSelectComment={handleSelectComment}
                  activeCommentId={activeCommentId}
                  setActiveCommentId={setActiveCommentId}
                  handleCloseForm={handleCloseForm}
                  commentWritgh={commentWritgh}
                  setCommentWritgh={setCommentWritgh}
                  addNewComment={addNewComment}
                  shouldShowButton={shouldShowButton}
                  hasCommentId={hasCommentId}
                  setCountCommentShow={setCountCommentShow}
                  countCommentShow={countCommentShow}
                  initialShowCommentCount={initialShowCommentCount}
                  showFullCommentsList={showFullCommentsList}
                  commentsTree={commentsTree}
                  handleUseGetPost_AfterAddNewComment={
                    handleUseGetPost_AfterAddNewComment
                  }
                />
              )}
            </>
            {hasCommentId && (
              <div className={styles.comment_limit_bottom}>
                <button
                  className={styles.link_button}
                  onClick={getAllCommentsOfPost}
                >
                  {t('singlePostPage.showAllComments')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
