import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from '../../useGlobalState.ts'
import { MorphShapesCSS } from '../../components/MorphShapesCSS/MorphShapesCSS.tsx'
import { LazyImage } from '../LazyImage/LazyImage.tsx'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import toast from 'react-hot-toast'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import eye from '../../assets/static/eye.svg'
import { basicUrl, basicColor } from '../../utilita/default.ts'
import styles from './BlogPost.module.css'

interface IBlogPostProps {
  postFull: IPostFull
  setFavorite: (num: number | ((prev: number) => number)) => void
  setNoFavorite: (num: number | ((prev: number) => number)) => void
  likeDislikePost: (up1: string, up2: number, up3: number) => void
  handleIncreaseViewPost: (val: string) => void
  // handleSelectPost: (selPost: IPostFull) => void
  // categoryId: string
}

export const BlogPost: React.FC<IBlogPostProps> = ({
  postFull,
  setFavorite,
  setNoFavorite,
  likeDislikePost,
  handleIncreaseViewPost,
  // handleSelectPost,
  // categoryId,
}) => {
  const [showFullPost, setShowFullPost] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEmailConfirm] = useGlobalState('isEmailConfirm')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const initialSectionsCount = 2

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const showComments = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const handleFavorite = async () => {
    // handleSelectPost(postFull)
    // setFavorite(postFull.favorite++)
    // const favorite = post.favorite + 1

    console.log('handleFavorite---post', postFull)
    console.log('handleFavorite---isEmailConfirm', isEmailConfirm)
    if (isEmailConfirm) {
      likeDislikePost(postFull._id!, postFull.favorite + 1, postFull.nofavorite)
    } else myToast(t('postPage.toast.confirmEmail'), basicColor.orange)
  }

  const handleNoFavorite = async () => {
    // handleSelectPost(postFull)
    // setNoFavorite(postFull.nofavorite++)
    if (isEmailConfirm) {
      likeDislikePost(postFull._id!, postFull.favorite, postFull.nofavorite + 1)
    } else myToast(t('postPage.toast.confirmEmail'), basicColor.orange)
  }

  const sectionsToDisplay = showFullPost
    ? postFull.sections
    : postFull.sections.slice(0, initialSectionsCount)

  const shouldShowButton = postFull.sections.length > initialSectionsCount

  useEffect(() => {
    setFavorite(postFull.favorite)
    setNoFavorite(postFull.nofavorite)
  }, [])

  // const styleIcon = post.liked ? 'red' : 'black'
  return (
    <div
      className={styles.content} // .concat(' content_short')
    >
      <div className={styles.content_header}>
        <div className={styles.author}>
          <a className={styles.author_avatar}>
            <div
              className={styles.avatar_container}
              // style={{
              //   backgroundImage: `url(${basicUrl.urlUserFiles}?id=${postFull.user._id}&nameImage=${postFull.user.avatar})`,
              // }}
            >
              {postFull.user.email === 'rm.splinter@yandex.ru' ? (
                <MorphShapesCSS />
              ) : (
                <img
                  src={`${basicUrl.urlUserFiles}?id=${postFull.user._id}&nameImage=${postFull.user.avatar}`}
                  height={'40px'}
                  width={'40px'}
                  style={{
                    // position: 'relative',
                    // top: '0px',
                    // left: '0px',
                    borderRadius: '50%',
                  }}
                />
              )}
              {/* <img src={morph} height={'40px'} width={'40px'} />  */}

              {/* Миниатюра категории */}
              <img
                src={`${basicUrl.urlDownload}?id=${postFull.categoryId}`}
                className={styles.category_badge}
              />
            </div>
          </a>
          <div className={styles.author_name}>{postFull.user.email}</div>
          <div className={styles.author_details}>
            {new Date(postFull.createdAt).toDateString()}
          </div>
        </div>
      </div>
      <div className={styles.content_body} data-post-id={postFull._id}>
        <h1 className={styles.content_title}>{postFull.title}</h1>
        <article className={styles.content_blocks}>
          <AnimatePresence>
            {sectionsToDisplay.map((item, index) => {
              return (
                <motion.div
                  key={`section-${postFull._id}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.type === 'text' ? (
                    <figure
                      className={styles.content_block}
                      // key={`section-${post._id}-${index}`}
                    >
                      <div className={styles.block_text}>{item.content}</div>
                    </figure>
                  ) : (
                    <figure
                      className={styles.block_wrapper_img}
                      // key={`section-${post._id}-${index}`}
                    >
                      {/* <img
                        //src={basicUrl.urlPostFiles}
                        className={styles.content_block_img}
                        src={`${basicUrl.urlPostFiles}?id=${postFull._id}&nameImage=${item.path}`}
                        alt={item.alt}
                        loading="lazy"
                      /> */}
                      <LazyImage
                        src={`${basicUrl.urlPostFiles}?id=${postFull._id}&nameImage=${item.path}`}
                        alt={item.alt!}
                        className={styles.content_block_img}
                      />
                    </figure>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {shouldShowButton && (
            <div className={styles.content_read_more}>
              <button
                className={styles.link_button}
                onClick={() => {
                  if (showFullPost === false)
                    handleIncreaseViewPost(postFull._id!)
                  setShowFullPost(true)
                }}
              >
                {showFullPost ? null : t('blogPost.showInFull')}
              </button>
            </div>
          )}
        </article>
      </div>
      <div className={styles.content_reactions}>
        <div className={styles.reactions}>
          <div className={styles.reaction_button} onClick={handleFavorite}>
            <img src={heartRed} width={21} height={21} loading="lazy" />
            <span className={styles.reaction_button_counter}>
              {postFull.favorite}
            </span>
          </div>
          <div className={styles.reaction_button} onClick={handleNoFavorite}>
            <img src={heartGrey} width={21} height={21} loading="lazy" />
            <span className={styles.reaction_button_counter}>
              {postFull.nofavorite}
            </span>
          </div>
          <div className={styles.reaction_eye}>
            <img src={eye} width="20px" height="20px" loading="lazy" />
            <span className={styles.reaction_button_counter}>
              {postFull.views}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.content_footer}>
        <a className={styles.comments_counter}>
          <button
            className={styles.content_footer_button}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => showComments(postFull._id!)}
          >
            <div className={styles.content_footer_button_icon}>
              <svg
                className={styles.icon_comment}
                viewBox="0 0 32 32"
                style={{
                  fill: isHovered ? '#0b5dd7' : 'currentColor',
                  stroke: isHovered ? '#0b5dd7' : 'currentColor',
                }}
              >
                <g id="message-circle" data-name="message-circle">
                  <path d="M16,29a13,13,0,0,1-6.09-1.52L5.08,28.75a1.5,1.5,0,0,1-1.83-1.83l1.27-4.83a13,13,0,0,1,9.86-19h0A13,13,0,1,1,17.15,29C16.77,29,16.38,29,16,29Zm-5.81-3.66.35.2A11,11,0,1,0,14.62,5.08h0A11,11,0,0,0,6.46,21.46l.2.35L5.4,26.6ZM14.5,4.09h0Z" />
                </g>
              </svg>
            </div>
            <div className={styles.comments_button_counter}>
              {postFull.countComments}
            </div>
          </button>
        </a>
      </div>
    </div>
  )
}
