import React, { useState } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { ICategory } from '../../utilita/modelCategory'
import { useNavigate } from 'react-router-dom'
import { basicUrl } from '../../utilita/default.ts'
import styles from './CategoryCard.module.css'

interface ICategoryCard {
  category: ICategory
  handleSelectCategory: (category: ICategory) => void
  maxWidth: number
}

export const CategoryCard: React.FC<ICategoryCard> = ({
  category,
  handleSelectCategory,
  maxWidth,
}) => {
  const [, setActiveSubPage] = useGlobalState('activeSubPage') // подменю - подстраницы
  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    category: ICategory,
  ) => {
    event.preventDefault()
    handleSelectCategory(category)
    setActiveSubPage(category._id!)
    navigate(`/${category._id}`)
  }

  return (
    <div
      className={styles.categoryItem}
      style={{ maxWidth: maxWidth }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={(event) => handleClick(event, category)}
        className={styles.nameCategoryBtn}
        style={{
          transform: isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 1s ease',
        }}
      >
        <div className={styles.front}>
          <h3 style={{ fontSize: '22px', margin: '10px 0' }}>
            {category.name}
          </h3>
          {/* <div
            id="image1"
            style={{
              // backgroundImage: `url(${basicUrl.urlDownload}?id=${category._id}&+rand=${random})`,
              backgroundImage: `url(${basicUrl.urlDownload}?id=${category._id})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '25px',
              height: '25px',
            }}
            className={styles.imgPng}
          ></div> */}
          <div>
            <img
              src={`${basicUrl.urlDownload}?id=${category._id}`}
              width={25}
              height={25}
              loading="lazy"
            />
          </div>
        </div>
        {/* {isHovered && ( */}
        <div
          className={styles.back}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            opacity: isHovered ? 1 : 0,
          }}
        >{`${category.description}`}</div>
        {/* )} */}
        {/* <img src={`${basicUrl.urlDownload}?id=${category._id}`} style={{width: '25px', height: '25px'}}/>             */}
      </button>
      {/* {isHovered && (<div className={styles.tooltip}>{`${category.description}`}</div>)}  */}
    </div>
  )
}
