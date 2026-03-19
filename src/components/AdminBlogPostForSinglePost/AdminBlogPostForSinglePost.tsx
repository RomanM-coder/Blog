import { MorphShapesCSS } from '../../components/MorphShapesCSS/MorphShapesCSS.tsx'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { basicUrl, production } from '../../utilita/default.ts'
import heartGrey from '../../assets/static/heart-fill-grey.svg'
import heartRed from '../../assets/static/heart-fill-red.svg'
import eye from '../../assets/static/eye.svg'
import styles from './AdminBlogPostForSinglePost.module.css'

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

interface AdminBlogPostForSinglePostProps {
  post: IPostFull
  handleLikeDislikePost: (up: IUpdatedPost) => void
  singleCategory: ICategory
}

export const AdminBlogPostForSinglePost: React.FC<
  AdminBlogPostForSinglePostProps
> = ({ post, handleLikeDislikePost, singleCategory }) => {
  const handleFavorite = async () => {
    const updatedPost: IUpdatedPost = {
      _id: post._id!,
      favorite: post.favorite + 1,
      nofavorite: post.nofavorite,
    }
    handleLikeDislikePost(updatedPost)
  }

  const handleNoFavorite = async () => {
    const updatedPost: IUpdatedPost = {
      _id: post._id!,
      favorite: post.favorite,
      nofavorite: post.nofavorite + 1,
    }
    handleLikeDislikePost(updatedPost)
  }

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
              {post.user.email === 'rm.splinter@yandex.ru' ? (
                <MorphShapesCSS />
              ) : (
                <img
                  //src={`${basicUrl.urlUserFiles}?id=${post.user._id}&nameImage=${post.user.avatar}`}
                  src={
                    production
                      ? `/uploads/avatars/${post.user.avatar}`
                      : `${basicUrl.urlUserFiles}?id=${post.user._id}&nameImage=${post.user.avatar}`
                  }
                  height={'40px'}
                  width={'40px'}
                  alt={`avatar-${post.user.email}`}
                  style={{ borderRadius: '50%' }}
                  loading="lazy"
                />
              )}
              {/* Миниатюра категории */}
              <img
                //src={`${basicUrl.urlDownload}?id=${post.categoryId}`}
                src={
                  production
                    ? `/categoryFiles/${singleCategory.name}/${singleCategory.link}`
                    : `${basicUrl.urlDownload}?id=${post.categoryId}`
                }
                className={styles.category_badge}
                alt={singleCategory.name}
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
      <div className={styles.content_body} data-post-id={post._id}>
        <h1 className={styles.content_title}>{post.title}</h1>
      </div>
      <div className={styles.content_reactions}>
        <div className={styles.reactions}>
          <div className={styles.reaction_button} onClick={handleFavorite}>
            <img
              src={heartRed}
              width={21}
              height={21}
              alt="heart-red"
              loading="lazy"
            />
            <span className={styles.reaction_button_counter}>
              {post.favorite}
            </span>
          </div>
          <div className={styles.reaction_button} onClick={handleNoFavorite}>
            <img
              src={heartGrey}
              width={21}
              height={21}
              alt="heart-grey"
              loading="lazy"
            />
            <span className={styles.reaction_button_counter}>
              {post.nofavorite}
            </span>
          </div>
          <div className={styles.reaction_eye}>
            <img
              src={eye}
              width="20px"
              height="20px"
              alt="eye"
              loading="lazy"
            />
            <span className={styles.reaction_button_counter}>{post.views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
