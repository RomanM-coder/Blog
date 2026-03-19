import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from '../../useGlobalState.ts'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import toast from 'react-hot-toast'
import { basicColor, basicUrl, production } from '../../utilita/default.ts'
import { IComment } from '../../utilita/modelComment'
import { ICommentTree } from '../../utilita/modelCommentTree'
import { CommentForm } from '../../components/CommentForm/CommentForm'
import styles from './CommentPostTree.module.css'
import { ICommentFull } from '../../utilita/modelCommentFull'

interface ICommentPostTreeProps {
  depth: number
  comment: ICommentTree
  // handleLikeComment: (comment: IComment) => void
  handleLikeDislikeComment: (comment: IComment) => void
  handleSelectComment: (comment: ICommentFull) => void
  activeCommentId: string | null
  setActiveCommentId: (id: string | null) => void
  // showChild?: boolean
  // setShowChild?: () => void
  showChild?: boolean
  setShowChild?: () => void
  getShowChild?: (commentId: string) => boolean // Добавляем
  toggleShowChild?: (commentId: string) => void // Добавляем
  handleCloseForm: (arg: boolean) => void
  commentWritgh: string
  setCommentWritgh: (commWritgh: string) => void
  last: boolean
  addNewComment: (newCom: string) => void
  handleUseGetPost_AfterAddNewComment: () => void
}

export const CommentPostTree: React.FC<ICommentPostTreeProps> = ({
  depth,
  comment,
  // handleLikeComment,
  handleLikeDislikeComment,
  handleSelectComment,
  activeCommentId,
  setActiveCommentId,
  showChild = false,
  setShowChild,
  getShowChild, // Получаем из props
  toggleShowChild, // Получаем из props
  handleCloseForm,
  commentWritgh,
  setCommentWritgh,
  last,
  addNewComment,
  handleUseGetPost_AfterAddNewComment,
}) => {
  // const [showChild, setShowChild] = useGlobalState('showChild')
  // const [showChild, setShowChild] = useState(false)
  const [isEmailConfirm] = useGlobalState('isEmailConfirm')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const handleClick = (postId: string, commentId: string) => {
    // setActiveSubPage(category.name)
    navigate(`/post/${postId}/${commentId}`) // comment_id - add
  }

  const handleLike = async () => {
    if (isEmailConfirm) {
      const updateComment = {} as IComment
      updateComment._id = comment._id
      updateComment.content = comment.content
      updateComment.createdAt = comment.createdAt
      updateComment.like = comment.like + 1
      updateComment.dislike = comment.dislike
      updateComment.owner = comment.user._id!
      updateComment.postId = comment.post._id!

      // handleSelectComment(updateComment)
      handleLikeDislikeComment(updateComment)
    } else myToast(t('postPage.toast.confirmEmail'), basicColor.orange)
  }

  const handleDislike = async () => {
    if (isEmailConfirm) {
      const updateComment = {} as IComment
      updateComment._id = comment._id
      updateComment.content = comment.content
      updateComment.createdAt = comment.createdAt
      updateComment.like = comment.like
      updateComment.dislike = comment.dislike + 1
      updateComment.owner = comment.user._id!
      updateComment.postId = comment.post._id!

      // handleSelectComment(updateComment)
      handleLikeDislikeComment(updateComment)
    } else myToast(t('postPage.toast.confirmEmail'), basicColor.orange)
  }

  const handleReplyClick = () => {
    if (isEmailConfirm) {
      setActiveCommentId(comment._id)
      // если не надо сохранять коммент
      try {
        localStorage.removeItem('commentDraft')
        console.log('Черновик очищен при инициализации ')
      } catch (error) {
        console.error('Ошибка очистки черновика:', error)
      }
    } else myToast(t('postPage.toast.confirmEmail'), basicColor.orange)
  }

  const handleCloseClick = () => {
    setActiveCommentId(null)
    if (setShowChild) {
      setShowChild() // Передаем commentId
    }
    // setShowChild(!showChild)
    // setShowChild(false)
    // если не надо сохранять коммент
    try {
      localStorage.removeItem('commentDraft')
      console.log('Черновик очищен при инициализации ')
    } catch (error) {
      console.error('Ошибка очистки черновика:', error)
    }
  }

  // Закрытие формы при успешной отправке или отмене
  // const handleCloseForm = () => {
  //   setActiveCommentId(null)
  // }

  return (
    <div className={styles.wrapperComment}>
      {depth !== 0 && (
        <div className={styles.commentBranches}>
          <div
            className={styles.commentBranch}
            style={{ borderLeft: last ? 'none' : '1px solid #e5e5e5' }}
          >
            <div className={styles.commentBranchArc}></div>
          </div>
        </div>
      )}
      <div
      // className={styles.comment}
      // initial={{ //opacity: 0,
      //   x: -20 }}
      // animate={{ //opacity: 1,
      //   x: 0 }}
      // exit={{ //opacity: 0,
      //   x: -20 }}
      // transition={{ duration: 0.5 }}
      >
        <div className={styles.headerComment}>
          {/* <div className={styles.wrapperImg}> */}
          <img
            className={styles.authorAvatar}
            width={'36px'}
            height={'36px'}
            //src={`${basicUrl.urlUserFiles}?id=${comment.user._id}&nameImage=${comment.user.avatar}`}
            src={
              production
                ? `/uploads/avatars/${comment.user.avatar}`
                : `${basicUrl.urlUserFiles}?id=${comment.user._id}&nameImage=${comment.user.avatar}`
            }
            alt={`avatar-${comment.user.email}`}
            loading="lazy"
          />
          {/* </div> */}
          <div className={styles.wrapperText}>
            <div className={styles.authorMain}>
              <div className={styles.authorName}>{comment.user.email}</div>
              {/* {tab === 'block-popularComments' && (
                <span className={styles.inPost}>в посте</span>
              )} */}
            </div>
            <div className={styles.wrapperDate}>
              <div className={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
            {/* {tab === 'block-popularComments' && (
              <div className={styles.authorDetail}>
                <div className={styles.postName}> */}
            {/* {comment.post.title} */}
            {/* Lorem ipsum dolor sit amet,
                  consectetur ipsum dolor sit amet ipsum dolor sit amet
                </div>
              </div>
            )} */}
          </div>
        </div>
        <p
          className={styles.titleComment}
          onClick={() => handleClick(comment.post._id!, comment._id)}
        >
          {comment.content}
        </p>
        <div className={styles.reactions}>
          <button className={styles.likedButton} onClick={handleLike}>
            <img
              src={heartRed}
              width={21}
              height={21}
              alt="heart-red"
              loading="lazy"
            />
            <p className={styles.likeComment}>{comment.like}</p>
          </button>
          <button className={styles.dislikedButton} onClick={handleDislike}>
            <img
              src={heartGrey}
              width={21}
              height={21}
              alt="heart-grey"
              loading="lazy"
            />
            <p className={styles.likeComment}>{comment.dislike}</p>
          </button>
        </div>
        <div className={styles.comment_footer}>
          {comment.related && comment.related.length > 0 && (
            <div className={styles.showChild} onClick={handleCloseClick}>
              {showChild
                ? t('singlePostPage.hide')
                : t('singlePostPage.response', {
                    count: comment.related.length,
                  })}
            </div>
          )}
          <div className={styles.responce} onClick={handleReplyClick}>
            {activeCommentId !== comment._id && (
              <div className={styles.responceButton}>
                {t('singlePostPage.toAnswer')}
              </div>
            )}
          </div>
        </div>
        {activeCommentId === comment._id && (
          <CommentForm
            handleCloseForm={handleCloseForm}
            showChild={showChild}
            commentWritgh={commentWritgh}
            setCommentWritgh={setCommentWritgh}
            // related={parent}
            parent={true}
            addNewComment={addNewComment}
            depth={depth}
            handleUseGetPost_AfterAddNewComment={
              handleUseGetPost_AfterAddNewComment
            }
          />
        )}
        <AnimatePresence>
          {showChild && (
            <motion.div
              key="child-comments"
              initial={{
                opacity: 0,
                //height: 0,
                // maxHeight: 0,
              }}
              animate={{
                opacity: 1,
                //height: 'auto',
                //maxHeight: 1000,
                transition: { duration: 1, ease: 'easeInOut' },
              }}
              exit={{
                opacity: 0,
                //height: 0,
                // maxHeight: 0,
                transition: { duration: 0.5, ease: 'easeInOut' },
              }}
              // transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Рекурсивно рендерим ответы */}
              {comment.related && comment.related.length > 0 && (
                <div className="related">
                  {/* <AnimatePresence> */}
                  {comment.related.map((relate, index) => (
                    <CommentPostTree
                      key={relate!._id}
                      depth={depth + 1}
                      comment={relate!}
                      // handleLikeComment={handleLikeComment}
                      handleLikeDislikeComment={handleLikeDislikeComment}
                      handleSelectComment={handleSelectComment}
                      activeCommentId={activeCommentId}
                      setActiveCommentId={setActiveCommentId}
                      showChild={
                        getShowChild ? getShowChild(relate!._id) : false
                      }
                      setShowChild={
                        toggleShowChild
                          ? () => toggleShowChild!(relate!._id)
                          : undefined
                      }
                      getShowChild={getShowChild} // Передаем ту же функцию getShowChild
                      toggleShowChild={toggleShowChild} // Передаем ту же функцию toggleShowChild
                      handleCloseForm={handleCloseForm}
                      commentWritgh={commentWritgh}
                      setCommentWritgh={setCommentWritgh}
                      last={comment.related?.length === index + 1}
                      addNewComment={addNewComment}
                      handleUseGetPost_AfterAddNewComment={
                        handleUseGetPost_AfterAddNewComment
                      }
                    />
                  ))}
                  {/* </AnimatePresence> */}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
