import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import { useCommentList } from './useCommentList.hook.ts'
import { useTranslation } from 'react-i18next'
import { CommentPostTree } from '../../components/CommentPostTree/CommentPostTree.tsx'
import { IComment } from '../../utilita/modelComment.ts'
import { ICommentTree } from '../../utilita/modelCommentTree.ts'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import styles from './CommentList.module.css'

interface ICommentListProps {
  commentsTreeToDisplay: ICommentTree[]
  handleLikeDislikeComment: (comment: IComment) => void
  handleSelectComment: (comment: ICommentFull) => void
  activeCommentId: string | null
  setActiveCommentId: (id: string | null) => void
  // showChild?: boolean
  // setShowChild?: (sc: boolean) => void
  handleCloseForm: (arg: boolean) => void
  commentWritgh: string
  setCommentWritgh: (commWritgh: string) => void
  addNewComment: (newCom: string) => void
  shouldShowButton: boolean
  hasCommentId: string
  setCountCommentShow: (num: number | ((prev: number) => number)) => void
  countCommentShow: number
  initialShowCommentCount: number
  showFullCommentsList: boolean
  commentsTree: ICommentTree[]
  handleUseGetPost_AfterAddNewComment: () => void
}

export const CommentList: React.FC<ICommentListProps> = memo(
  ({
    commentsTreeToDisplay,
    handleLikeDislikeComment,
    handleSelectComment,
    activeCommentId,
    setActiveCommentId,
    handleCloseForm,
    commentWritgh,
    setCommentWritgh,
    addNewComment,
    // shouldShowButton,
    hasCommentId,
    setCountCommentShow,
    countCommentShow,
    initialShowCommentCount,
    // showFullCommentsList,
    commentsTree,
    handleUseGetPost_AfterAddNewComment,
  }) => {
    // const [expandedComments, setExpandedComments] = useState<Set<string>>(
    //   new Set()
    // )
    // const [showChild, setShowChild] = useGlobalState('showChild')
    // const [heights, setHeights] = useState<Record<string, number>>({})
    // const [pendingRemoval, setPendingRemoval] = useState<Set<string>>(new Set())
    // const [scrollReverse, setScrollReverse] = useState(false)
    const startAnimationShowComments = useRef(0)
    const [containerHeight, setContainerHeight] = useState<number | 'auto'>(
      'auto',
    )
    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleCount, setVisibleCount] = useState(initialShowCommentCount)
    const { getShowChild, toggleShowChild } = useCommentList()
    const { t } = useTranslation()

    // const shouldShowButton = useMemo(
    //   () => visibleCount >= initialShowCommentCount,
    //   [visibleCount, initialShowCommentCount]
    // )

    const shouldShowButton = useMemo(
      () =>
        visibleCount >= initialShowCommentCount &&
        commentsTree.length > initialShowCommentCount,
      [visibleCount, initialShowCommentCount],
    )

    const visibleShowFullCommentsList = useMemo(
      () => countCommentShow * initialShowCommentCount >= commentsTree.length,
      [countCommentShow, initialShowCommentCount, commentsTree.length],
    )

    const handleRemoveComments = () => {
      setVisibleCount(initialShowCommentCount)
      setCountCommentShow(1)
    }

    // const calculateHeight = useCallback(() => {
    //   const visibCommentsTree = commentsTreeToDisplay.slice(0, visibleCount)

    //   const totalHeight = visibCommentsTree.reduce((sum, comment) => {
    //     const el = document.getElementById(`comment-${comment._id}`)
    //     if (el) {
    //       const rect = el.getBoundingClientRect()
    //       return sum + rect.height // Только высота элемента
    //     }
    //     return sum //+ 80
    //     // return sum + (el?.scrollHeight || 80)
    //   }, 0)
    //   setContainerHeight(totalHeight)
    // }, [visibleCount, commentsTreeToDisplay])

    const calculateHeight = useCallback(() => {
      const visibCommentsTree = commentsTreeToDisplay.slice(0, visibleCount)
      let totalHeight = 0

      // Используем requestAnimationFrame для группировки операций
      requestAnimationFrame(() => {
        visibCommentsTree.forEach((comment) => {
          const el = document.getElementById(`comment-${comment._id}`)
          if (el) {
            // Используем offsetHeight вместо getBoundingClientRect (быстрее)
            totalHeight += el.offsetHeight
          } //else {
          //totalHeight += 80 // fallback
          //}
        })
        setContainerHeight(totalHeight)
      })
    }, [visibleCount, commentsTreeToDisplay])

    // Пересчет после изменений состояний комментариев
    useEffect(() => {
      const timeoutId = setTimeout(calculateHeight, 550)

      return () => clearTimeout(timeoutId)
    }, [getShowChild])

    // Первоначальный расчет
    useEffect(() => {
      const timeoutId = setTimeout(calculateHeight, 100)

      return () => clearTimeout(timeoutId)
    }, [calculateHeight])

    return (
      <div className={styles.commentsContainerWrapper}>
        <div
          ref={containerRef}
          // className={styles.comments_container +' '+ showFullCommentsList ? styles.fast : styles.slow }
          className={
            startAnimationShowComments.current === 1
              ? visibleCount === initialShowCommentCount
                ? styles.animation_slow
                : styles.animation_fast + ' ' + styles.comments_container
              : styles.animation_fast + ' ' + styles.comments_container
          }
          style={{
            height: containerHeight,
            overflow: 'hidden',
            // transition: `height ${
            //   visibleShowFullCommentsList ? 0.3 : 1.5
            // }s ease-in-out`,
          }}
          // initial={false}
          // animate={{
          //   height: containerHeight,
          //   transition: { duration: 0.3, ease: 'easeInOut' },
          // }}
          // exit={{
          //   height: 0,
          //   transition: { duration: 3, ease: 'easeInOut' },
          // }}
        >
          {commentsTreeToDisplay.map((commentTree, index) => {
            // console.log('commentTree in CommentList=', commentTree)
            return (
              <div
                key={commentTree._id}
                id={`comment-${commentTree._id}`}
                className={styles.comment_item}
              >
                <CommentPostTree
                  depth={1}
                  comment={commentTree}
                  handleLikeDislikeComment={handleLikeDislikeComment}
                  handleSelectComment={handleSelectComment}
                  activeCommentId={activeCommentId}
                  setActiveCommentId={setActiveCommentId}
                  handleCloseForm={handleCloseForm}
                  commentWritgh={commentWritgh}
                  setCommentWritgh={setCommentWritgh}
                  // last={commentsTreeToDisplay.length === index + 1}
                  // last={visibleCount === index + 1}
                  last={
                    (visibleCount >= commentsTree.length &&
                      commentsTree.length === index + 1) ||
                    (visibleCount === index + 1 &&
                      visibleCount < commentsTree.length)
                      ? true
                      : false
                  }
                  addNewComment={addNewComment}
                  showChild={getShowChild(commentTree._id)}
                  setShowChild={() => toggleShowChild(commentTree._id)}
                  getShowChild={getShowChild} // Передаем функцию getShowChild
                  toggleShowChild={toggleShowChild}
                  handleUseGetPost_AfterAddNewComment={
                    handleUseGetPost_AfterAddNewComment
                  }
                />
              </div>
            )
          })}
        </div>

        {shouldShowButton && !hasCommentId && (
          <div className={styles.content_read_more}>
            <button className={styles.link_button}>
              {visibleShowFullCommentsList ? ( // на маленьких значениях commentsTree.length не работает
                <div onClick={handleRemoveComments}>
                  {t('singlePostPage.rollUp')}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setVisibleCount((prev) => {
                      if (
                        commentsTree.length -
                          countCommentShow * initialShowCommentCount <=
                        0
                      )
                        return 3
                      else return prev + 3
                    })
                    setCountCommentShow((prev) => {
                      if (
                        commentsTree.length -
                          countCommentShow * initialShowCommentCount <=
                        0
                      )
                        return 1
                      else return prev + 1
                    })
                    startAnimationShowComments.current = 1
                  }}
                >
                  {t('singlePostPage.response', {
                    count:
                      commentsTree.length -
                      countCommentShow * initialShowCommentCount,
                  })}
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    )
  },
)
