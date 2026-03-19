import React, { useState } from 'react'
import { usePrefetch } from '../../utilita/usePrefetch.ts'
import { ICategory } from '../../utilita/modelCategory'
import { ICategoryForm } from '../../utilita/modelCategoryForm.ts'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../../useGlobalState.ts'
import { basicUrl, production } from '../../utilita/default.ts'
import pencil from '../../assets/static/pencil-fill.svg'
import basket from '../../assets/static/trash-bin-sharp.svg'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminCategoryCard.module.css'

type GetFieldTranslationCategoryResponse =
  | { success: true; selectCategory: ICategoryForm }
  | { success: false; message: string }

interface ICategoryCard {
  category: ICategory
  useGetFieldTranslation: (
    selectCategory: ICategory,
    signal?: AbortSignal,
  ) => Promise<GetFieldTranslationCategoryResponse>
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory>>
  setMode: (str: 'add' | 'edit' | undefined) => void
  handleAddEditFormShow: () => void
  handleDeleteFormShow: () => void
  maxWidth: number
}

export const AdminCategoryCard: React.FC<ICategoryCard> = ({
  category,
  setMode,
  useGetFieldTranslation,
  setSelectedCategory,
  handleAddEditFormShow,
  handleDeleteFormShow,
  maxWidth,
}) => {
  const [, setActiveSubPage] = useGlobalState('activeSubPage') // подменю - подстраницы
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const prefetchAdminPost = usePrefetch(
    () => import('../../pages/Admin/AdminPost/AdminPost.tsx'),
  )

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    category: ICategory,
  ) => {
    event.preventDefault()
    setSelectedCategory(category)
    setActiveSubPage(category._id!)
    navigate(`/admin/posts/${category._id}`)
  }

  const handleDelete = () => {
    setSelectedCategory(category)
    handleDeleteFormShow()
  }
  const handleEdit = async () => {
    setSelectedCategory(category)

    const loadCategory = async () => {
      const result = await useGetFieldTranslation(category)

      if (result.success) {
        setMode('edit')
        handleAddEditFormShow()
      } else {
        console.error('Failed to load translation:', result.message)
      }
    }
    loadCategory()
  }

  return (
    <>
      <div
        className={styles.categoryItem}
        style={{ maxWidth: maxWidth }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={(event) => handleClick(event, category)}
          onMouseEnter={prefetchAdminPost}
          onTouchStart={prefetchAdminPost}
          className={styles.nameCategoryBtn}
        >
          <h3
            style={{
              fontSize: '25px',
              margin: '10px 0',
              opacity: isHovered ? 0.55 : 1,
              transition: 'opacity 0.25s ease',
            }}
          >
            {category.name}
          </h3>
          {/* <div
            id="image1"
            style={{
              backgroundImage: `url(${basicUrl.urlDownload}?id=${category._id})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '25px',
              height: '25px',
            }}
            className={styles.imgPng}
          ></div> */}
          <div>
            {/* <LazyImage
              src={`${basicUrl.urlDownload}?id=${category._id}`}
              alt={`${category.link}`}
              className={styles.imgPng}
              style={{
                width: '25px',
                height: '25px',
              }}
            /> */}
            <img
              //src={`${basicUrl.urlDownload}?id=${category._id}`}
              src={
                production
                  ? `/categoryFiles/${category.name}/${category.link}`
                  : `${basicUrl.urlDownload}?id=${category._id}`
              }
              width={70}
              height={70}
              alt={category.name}
              // loading="lazy"
            />
          </div>
        </button>

        <div className={styles.containerAction}>
          <button className={styles.buttonButton} onClick={handleEdit}>
            <div className={styles.wrapperPencil}>
              {/* <LazyImage
                src={'/src/assets/static/media/pencil-fill.svg'}
                alt={'pencil-fill.svg'}
                className={styles.imgPng}
                style={{
                  width: '20px',
                  height: '20px',
                }}
              /> */}
              {/* <img src={pencil} width={20} height={20} /> */}
              <img
                src={pencil}
                width={20}
                height={20}
                alt="pensil"
                // loading="lazy"
              />
            </div>
          </button>
          <button className={styles.buttonButton} onClick={handleDelete}>
            <div className={styles.wrapperBasket}>
              {/* <LazyImage
                src={'/src/assets/static/media/trash-bin-sharp.svg'}
                alt={'trash-bin-sharp.svg'}
                className={styles.imgPng}
                style={{
                  width: '24px',
                  height: '24px',
                }}
              /> */}
              {/* <img src={basket} width={24} height={24} /> */}
              <img
                src={basket}
                width={24}
                height={24}
                alt="basket"
                //  loading="lazy"
              />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
