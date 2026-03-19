import React, { Dispatch, SetStateAction } from 'react'
import { basicUrl, production } from '../../utilita/default.ts'
import { MorphShapesCSS } from '../../components/MorphShapesCSS/MorphShapesCSS.tsx'
import { ICommentForm } from '../../utilita/modelCommentForm.ts'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import pencil from '../../assets/static/pencil-fill.svg'
import basket from '../../assets/static/trash-bin-sharp.svg'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import styles from './AdminComment.module.css'

type GetFieldTranslationComment =
  | { success: true; selectComment: ICommentForm }
  | { success: false; message: string }

interface IUpdatedComment {
  _id: string
  like: number
  dislike: number
}

interface IAdminCommentProps {
  comment: ICommentFull
  handleLikeDislikeComment: (ucom: IUpdatedComment) => void
  setMode: Dispatch<SetStateAction<'add' | 'edit'>>
  setSelectedComment: Dispatch<SetStateAction<ICommentFull>>
  useGetFieldTranslationComment: (
    selectComment: ICommentFull,
  ) => Promise<GetFieldTranslationComment>
  handleAddEditCommentFormShow: () => void
  handleDeleteCommentFormShow: () => void
}

export const AdminComment: React.FC<IAdminCommentProps> = ({
  comment,
  handleLikeDislikeComment,
  setMode,
  setSelectedComment,
  useGetFieldTranslationComment,
  handleAddEditCommentFormShow,
  handleDeleteCommentFormShow,
}) => {
  const handleEdit = async (comment: ICommentFull) => {
    setMode('edit')
    setSelectedComment(comment)
    console.log('handleEdit=>comment', comment)

    const loadComment = async () => {
      const result = await useGetFieldTranslationComment(comment)

      if (result.success) {
        setMode('edit')
        handleAddEditCommentFormShow()
      } else {
        console.error('Failed to load translation:', result.message)
      }
    }
    loadComment()
  }

  const handleDelete = async (comment: ICommentFull) => {
    setSelectedComment(comment)
    handleDeleteCommentFormShow()
  }

  const handleLike = async (comment: ICommentFull) => {
    const updateComment = {} as IUpdatedComment
    updateComment._id = comment._id
    updateComment.like = comment.like + 1
    updateComment.dislike = comment.dislike
    handleLikeDislikeComment(updateComment)
  }

  const handleDislike = async (comment: ICommentFull) => {
    const updateComment = {} as IUpdatedComment
    updateComment._id = comment._id
    updateComment.like = comment.like
    updateComment.dislike = comment.dislike + 1
    handleLikeDislikeComment(updateComment)
  }

  return (
    <div className={styles.comment}>
      <div>
        <div className={styles.content_header}>
          <div className={styles.author}>
            <a className={styles.author_avatar}>
              <div
                className={styles.avatar_container}
                // style={{
                //   backgroundImage: `url(${basicUrl.urlUserFiles}?id=${postFull.user._id}&nameImage=${postFull.user.avatar})`,
                // }}
              >
                {comment.user.email === 'rm.splinter@yandex.ru' ? (
                  <MorphShapesCSS />
                ) : (
                  <img
                    //src={`${basicUrl.urlUserFiles}?id=${comment.user._id}&nameImage=${comment.user.avatar}`}
                    src={
                      production
                        ? `/uploads/avatars/${comment.user.avatar}`
                        : `${basicUrl.urlUserFiles}?id=${comment.user._id}&nameImage=${comment.user.avatar}`
                    }
                    height={'40px'}
                    width={'40px'}
                    alt={`avatar-${comment.user.email}`}
                    style={{ borderRadius: '50%' }}
                    loading="lazy"
                  />
                )}
              </div>
            </a>
            <div className={styles.author_name}>{comment.user.email}</div>
            <div className={styles.author_details}>
              {new Date(comment.createdAt).toDateString()}
            </div>
          </div>
        </div>
        <p className={styles.titleComment}>{comment.content}</p>
        {/*<button
          className={styles.likedButton}
          onClick={() => handleLike(comment)}
        >
          <p className={styles.likeComment}>{comment.like}</p>
          <img src={heartRed} width={21} height={21} />
        </button>
        <button
          className={styles.dislikedButton}
          onClick={() => handleDislike(comment)}
        >
          <p className={styles.likeComment}>{comment.dislike}</p>
          <img src={heartGrey} width={21} height={21} />
        </button> */}
        <div className={styles.content_reactions}>
          <div className={styles.reactions}>
            <div
              className={styles.reaction_button}
              onClick={() => handleLike(comment)}
            >
              <img
                src={heartRed}
                width={21}
                height={21}
                alt="heart-red"
                loading="lazy"
              />
              <span className={styles.reaction_button_counter}>
                {comment.like}
              </span>
            </div>
            <div
              className={styles.reaction_button}
              onClick={() => handleDislike(comment)}
            >
              <img
                src={heartGrey}
                width={21}
                height={21}
                alt="heart-grey"
                loading="lazy"
              />
              <span className={styles.reaction_button_counter}>
                {comment.dislike}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.containerAction}>
        <button
          className={styles.editButton}
          onClick={() => handleEdit(comment)}
        >
          <div className={styles.wrapperPencil}>
            <img
              src={pencil}
              width={20}
              height={20}
              alt="pencil"
              loading="lazy"
            />
          </div>
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => handleDelete(comment)}
        >
          <img
            src={basket}
            width={24}
            height={24}
            alt="basket"
            loading="lazy"
          />
        </button>
      </div>
    </div>
  )
}
