import React, { memo } from 'react'
import { BlogPost } from '../../components/BlogPost/BlogPost.tsx'
import { InsertInPostList } from '../../pages/InsertInPostList/InsertInPostList.tsx'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import styles from './PostList.module.css'

interface IPostListProps {
  postsFull: IPostFull[]
  setFavorite: (num: number | ((prev: number) => number)) => void
  setNoFavorite: (num: number | ((prev: number) => number)) => void
  likeDislikePost: (up1: string, up2: number, up3: number) => void
  handleIncreaseViewPost: (val: string) => void
  hasPostId: string
  hasCommentId: string
  activeCommentId: string
  setActiveCommentId: (commId: string | null) => void
  handleUseGetPost_AfterAddNewComment: () => void
  categoryList: ICategory[]
}

export const PostList: React.FC<IPostListProps> = memo(
  ({
    postsFull,
    setFavorite,
    setNoFavorite,
    likeDislikePost,
    handleIncreaseViewPost,
    hasPostId,
    hasCommentId,
    activeCommentId,
    setActiveCommentId,
    handleUseGetPost_AfterAddNewComment,
    categoryList,
  }) => {
    // const { commentId } = useParams()

    return (
      <>
        {postsFull.map((postFull) => {
          return (
            <React.Fragment key={postFull._id}>
              <div className={styles.postWrapper}>
                <div
                  className={styles.postContainer}
                  style={{ minHeight: '450px' }}
                >
                  <BlogPost
                    postFull={postFull}
                    setFavorite={setFavorite}
                    setNoFavorite={setNoFavorite}
                    likeDislikePost={likeDislikePost}
                    handleIncreaseViewPost={handleIncreaseViewPost}
                    categoryS={categoryList.find(
                      (category) => category._id === postFull.categoryId,
                    )}
                  />
                </div>
              </div>
              {hasPostId !== undefined && hasPostId === postFull._id && (
                <div
                  key={`comment-${postFull._id}`}
                  className={styles.postWrapper}
                >
                  <div
                    className={styles.postContainer}
                    style={{ minHeight: '200px' }}
                  >
                    {/* комментарии  => если comment.postId = post._id*/}
                    {/* что должно быть: сам коммент и все комменты, связанные с ним, кнопка раскрыть комменты
                           входные данные: comment._id */}
                    <InsertInPostList
                      hasCommentId={hasCommentId}
                      activeCommentId={activeCommentId!}
                      setActiveCommentId={setActiveCommentId}
                      handleUseGetPost_AfterAddNewComment={
                        handleUseGetPost_AfterAddNewComment
                      }
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </>
    )
  },
)
