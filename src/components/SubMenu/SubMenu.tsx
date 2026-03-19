import React, { MutableRefObject, useContext } from 'react'
import { motion, Variants } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useGlobalState } from '../../useGlobalState'
import { SearchContext } from '../../context/SearchContext.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import styles from './SubMenu.module.css'

interface ISubMenuProps {
  isOpenHamburger: boolean
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  motionElemRef: React.RefObject<HTMLDivElement>
  isClickRedCrossRef: MutableRefObject<boolean>
  setIsOpenHamburger: (bul: boolean) => void
  categoryList: ICategory[]
  activeSubPage: string
  setActiveSubPage: (val: string) => void
  setActivePage: (val: number) => void
  position: { top: number; left: number }
}

export const SubMenu: React.FC<ISubMenuProps> = ({
  isOpenHamburger,
  isOpen,
  setIsOpen,
  motionElemRef,
  isClickRedCrossRef,
  setIsOpenHamburger,
  categoryList,
  activeSubPage,
  setActiveSubPage,
  setActivePage,
  position,
}) => {
  const [isAdmin] = useGlobalState('isAdmin')
  const search = useContext(SearchContext)

  const ulVariants2: Variants = {
    dropdownOpen: {
      clipPath: 'inset(0% 0% 0% 0% round 8px)',
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.25,
        delayChildren: 0.15,
        staggerChildren: 0.05,
      },
    },
    dropdownClose: {
      clipPath: 'inset(10% 50% 90% 50% round 8px)',
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.15,
        when: 'afterChildren',
        staggerDirection: -1,
        staggerChildren: 0.03,
      },
    },
  }
  const itemVariants2: Variants = {
    dropdownOpen: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 600, damping: 30, mass: 0.5 },
      //transition: {stiffness: 300, damping: 24, duration: 0.3}
    },
    dropdownClose: {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(20px)',
      transition: { duration: 0.1 },
    },
  }

  const toggleDropdown = (categoryId: string) => {
    if (categoryId !== activeSubPage) {
      if (categoryId) {
        setActiveSubPage(categoryId)
        setActivePage(1)
        search.clearSearch()

        if (isOpenHamburger) {
          isClickRedCrossRef.current = true
          if (isOpen) {
            // Если подменю открыто, сначала закрываем его
            setIsOpen(false)
          } else {
            // Если подменю уже закрыто, закрываем основное меню
            setIsOpenHamburger(false)
          }
        } else {
          if (isOpen) {
            setIsOpen(false)
          }
        }
      }
    }
  }

  return (
    <motion.div
      className={styles.postDropdown}
      key={`postDropdown-${isOpenHamburger}`}
      ref={motionElemRef} // для клика вне области списка
      initial="dropdownClose"
      animate={isOpen ? 'dropdownOpen' : 'dropdownClose'}
      exit="dropdownClose"
      variants={ulVariants2}
      onAnimationComplete={(definition) => {
        if (definition === 'dropdownClose' && isClickRedCrossRef.current) {
          // После закрытия подменю закрываем основное меню
          setIsOpenHamburger(false)
        }
      }}
      style={{
        top: `${position.top + 12}px`,
        left: `${position.left - (isOpenHamburger ? 115 : 0)}px`,
      }}
    >
      <ul className={styles.dropdownContent}>
        {categoryList?.length &&
          categoryList.map((category) => {
            return (
              <motion.li
                key={`${category._id}`}
                aria-checked={activeSubPage === category._id!}
                className={styles.menuSub}
                variants={itemVariants2}
              >
                {typeof isAdmin === 'boolean' &&
                  (isAdmin === true ? (
                    <NavLink
                      to={`/admin/posts/${category._id}`}
                      onClick={() => toggleDropdown(category._id!)}
                    >
                      {category.name}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={`/category/${category._id}`}
                      onClick={() => toggleDropdown(category._id!)}
                    >
                      {category.name}
                    </NavLink>
                  ))}
              </motion.li>
            )
          })}
      </ul>
    </motion.div>
  )
}
