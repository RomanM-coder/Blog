import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import { basicUrl, production } from '../../utilita/default.ts'
import { ICommentFull } from '../../utilita/modelCommentFull'
import styles from './CommentPost.module.css'

interface ICommentPostProps {
  tab: string
  comment: ICommentFull
}

export const CommentPost: React.FC<ICommentPostProps> = ({ tab, comment }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClick = (postId: string, commentId: string) => {
    // setActiveSubPage(category.name)
    navigate(`/post/${postId}/${commentId}`) // comment_id - add
  }

  return (
    <div
      className={styles.comment}
      style={{
        border: tab === 'block-posts' ? 'none' : 'border: 1px solid #b1b0b0',
      }}
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
            <span className={styles.inPost}>{t('singlePostPage.inPost')}</span>
          </div>

          <div className={styles.authorDetail}>
            <div className={styles.postName}>{comment.post.title}</div>
          </div>
        </div>
      </div>
      <p
        className={styles.titleComment}
        onClick={() => handleClick(comment.post._id!, comment._id)}
      >
        {comment.content}
      </p>
      <div className={styles.reactions}>
        <button className={styles.likedButton}>
          <img
            src={heartRed}
            width={21}
            height={21}
            alt="heart-red"
            loading="lazy"
          />
          <p className={styles.likeComment}>{comment.like}</p>
        </button>
        <button className={styles.dislikedButton}>
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
    </div>
  )
}
