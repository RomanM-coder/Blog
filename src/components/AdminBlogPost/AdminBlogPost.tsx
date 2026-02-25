import { useEffect, useState } from 'react'
import { MorphShapesCSS } from '../../components/MorphShapesCSS/MorphShapesCSS.tsx'
import { useTranslation } from 'react-i18next'
import { LazyImage } from '../../components/LazyImage/LazyImage.tsx'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import { basicUrl } from '../../utilita/default.ts'
import eye from '../../assets/static/eye.svg'
import pencil from '../../assets/static/pencil-fill.svg'
import basket from '../../assets/static/trash-bin-sharp.svg'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import { IPostForm } from '../../utilita/modelPostForm'
import { useNavigate } from 'react-router-dom'
import styles from './AdminBlogPost.module.css'
import { IUser } from '../../utilita/modelUser.ts'

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

type outUseGetFieldTranslationPost =
  | { success: true; selectPost: IPostForm }
  | { success: false; message: string; typeError: string }

interface IAdminBlogPostProps {
  post: IPostFull
  setModePost: (mode: 'add' | 'edit') => void
  setFavorite: (num: number | ((prev: number) => number)) => void
  setNoFavorite: (num: number | ((prev: number) => number)) => void
  likePost: (up: IUpdatedPost) => void
  useGetFieldTranslation: (
    selPost: IPostFull,
  ) => Promise<outUseGetFieldTranslationPost>
  handleSelectPost: (post: IPostFull) => void
  handleAddEditFormShow: () => void
  handleDeleteFormShow: () => void
  categoryId: string
}

export const AdminBlogPost: React.FC<IAdminBlogPostProps> = ({
  post,
  setModePost,
  setFavorite,
  setNoFavorite,
  likePost,
  useGetFieldTranslation,
  handleSelectPost,
  handleAddEditFormShow,
  handleDeleteFormShow,
  categoryId,
}) => {
  const [showFullPost, setShowFullPost] = useState(false)
  // const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const initialSectionsCount = 2

  const { t } = useTranslation()

  const handleFavorite = async () => {
    const updatedPost = {} as IUpdatedPost
    updatedPost._id = post._id
    updatedPost.favorite = post.favorite + 1
    updatedPost.nofavorite = post.nofavorite
    likePost(updatedPost)
  }

  const handleNoFavorite = async () => {
    const updatedPost = {} as IUpdatedPost
    updatedPost._id = post._id
    updatedPost.favorite = post.favorite + 1
    updatedPost.nofavorite = post.nofavorite
    likePost(updatedPost)
  }

  const handleDelete = () => {
    handleSelectPost(post)
    handleDeleteFormShow()
  }
  const handleEdit = async () => {
    handleSelectPost(post)

    const loadPost = async () => {
      const result = await useGetFieldTranslation(post)
      if (result.success) {
        setModePost('edit')
        handleAddEditFormShow()
      } else {
        console.error('Failed to load translation:', result.message)
      }
    }
    loadPost()
    // await new Promise((resolve) => setTimeout(resolve, 300))
  }
  const handlePostTitle = () => {
    handleSelectPost(post)
    navigate(`/admin/post/${post._id}?categoryId=${categoryId}`)
  }

  const handleClickAvatar = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    user: IUser,
  ) => {
    event.preventDefault()
    // setSelectedUser(item)
    navigate(`/admin/user/${user._id}`)
  }

  const sectionsToDisplay = showFullPost
    ? post.sections
    : post.sections.slice(0, initialSectionsCount)

  const shouldShowButton = post.sections.length > initialSectionsCount

  useEffect(() => {
    setFavorite(post.favorite)
    setNoFavorite(post.nofavorite)
  }, [])

  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        <div className={styles.postHeader}>
          <div className={styles.containerHeader}>
            <div className={styles.content_header}>
              <div className={styles.author}>
                <a
                  className={styles.author_avatar}
                  onClick={(e) => handleClickAvatar(e, post.user)}
                >
                  <div
                    className={styles.avatar_container}
                    // style={{
                    //   backgroundImage: `url(${basicUrl.urlUserFiles}?id=${postFull.user._id}&nameImage=${postFull.user.avatar})`,
                    // }}
                  >
                    {post.user.email === 'rm.splinter@yandex.ru' ? (
                      <MorphShapesCSS />
                    ) : (
                      <img
                        src={`${basicUrl.urlUserFiles}?id=${post.user._id}&nameImage=${post.user.avatar}`}
                        height={'40px'}
                        width={'40px'}
                        style={{
                          // position: 'relative',
                          // top: '0px',
                          // left: '0px',
                          borderRadius: '50%',
                        }}
                        loading="lazy"
                      />
                    )}
                    {/* <img src={morph} height={'40px'} width={'40px'} />  */}

                    {/* Миниатюра категории */}
                    <img
                      src={`${basicUrl.urlDownload}?id=${post.categoryId}`}
                      className={styles.category_badge}
                      loading="lazy"
                    />
                  </div>
                </a>
                <div className={styles.author_name}>{post.user.email}</div>
                <div className={styles.author_details}>
                  {new Date(post.createdAt).toDateString()}
                </div>
              </div>
            </div>
            <div className={styles.containerAction}>
              <button className={styles.buttonButton} onClick={handleEdit}>
                <div className={styles.wrapperPencil}>
                  <img src={pencil} width={20} height={20} loading="lazy" />
                </div>
              </button>
              <button className={styles.buttonButton} onClick={handleDelete}>
                <div className={styles.wrapperBasket}>
                  <img src={basket} width={24} height={24} loading="lazy" />
                </div>
              </button>
            </div>
          </div>

          <h3 className={styles.h3Header} onClick={handlePostTitle}>
            {post.title}
          </h3>
        </div>
        <div className={styles.paragraphContainer}>
          {/* <Link
            to={`/admin/post/${post._id}?categoryId=${categoryId}`}
            className={styles.aLink}
          > */}
          {/* <Route path="/admin/posts/:id" element={<AdminSinglePost />} />  */}
          {/* <p className={styles.paragraph}>{post.description}</p>             */}
          {/* </Link> */}

          {/* <AnimatePresence> */}
          {sectionsToDisplay.map((item, index) => {
            return (
              <div
                key={`section-${post._id}-${index}`}
                style={{ width: '100%' }}
                // initial={{ opacity: 0, y: 50 }}
                // animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -50 }}
                // transition={{ duration: 0.5 }}
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
                    <LazyImage
                      src={`${basicUrl.urlPostFiles}?id=${post._id}&nameImage=${item.path}`}
                      alt={item.alt!}
                      className={styles.content_block_img}
                    />
                    {/* <img
                      //src={basicUrl.urlPostFiles}
                      className={styles.content_block_img}
                      src={`${basicUrl.urlPostFiles}?id=${post._id}&nameImage=${item.path}`}
                      alt={item.alt}
                      loading="lazy"
                    /> */}
                  </figure>
                )}
              </div>
            )
          })}
          {/* </AnimatePresence> */}
          {shouldShowButton && (
            <div className={styles.content_read_more}>
              <button
                className={styles.link_button}
                onClick={() => {
                  if (showFullPost === false)
                    // handleIncreaseViewPost(postFull._id!)
                    setShowFullPost(true)
                }}
              >
                {showFullPost ? null : t('adminPostPage.showInFull')}
              </button>
            </div>
          )}
        </div>
        <div className={styles.content_reactions}>
          <div className={styles.reactions}>
            <div className={styles.reaction_button} onClick={handleFavorite}>
              {/* <LazyImage
                src={'/src/assets/static/media/heart-fill-red.svg'}
                alt={'heart-fill-red.svg'}
                className={styles.imgPng}
                style={{
                  width: '21px',
                  height: '21px',
                }}
              /> */}
              {/* <img src={heartRed} width={21} height={21} /> */}
              <img src={heartRed} width={21} height={21} loading="lazy" />
              <span className={styles.reaction_button_counter}>
                {post.favorite}
              </span>
            </div>
            <div className={styles.reaction_button} onClick={handleNoFavorite}>
              {/* <LazyImage
                src={'/src/assets/static/media/heart-fill-grey.svg'}
                alt={'heart-fill-grey.svg'}
                className={styles.imgPng}
                style={{
                  width: '21px',
                  height: '21px',
                }}
              /> */}
              {/* <img src={heartGrey} width={21} height={21} /> */}
              <img src={heartGrey} width={21} height={21} loading="lazy" />
              <span className={styles.reaction_button_counter}>
                {post.nofavorite}
              </span>
            </div>
            <div className={styles.reaction_eye}>
              {/* <LazyImage
                src={'/src/assets/static/media2/eye.svg'}
                alt={'eye.svg'}
                className={styles.imgPng}
                style={{
                  width: '20px',
                  height: '20px',
                }}
              /> */}
              {/* <img src={eye} width="20px" height="20px" /> */}
              <img src={eye} width="20px" height="20px" loading="lazy" />
              <span className={styles.reaction_button_counter}>
                {post.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
