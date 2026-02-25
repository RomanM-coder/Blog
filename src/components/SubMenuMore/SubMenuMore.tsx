import React, { useContext, ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { SearchContext } from '../../context/SearchContext.ts'
import styles from './SubMenuMore.module.css'

interface ISubMenuMoreProps {
  isMoreOpen: boolean
  setIsMoreOpen: (val: boolean) => void
  motionElemMoreRef: React.RefObject<HTMLDivElement>
  hiddenItems: ReactNode[]
  activePage: number
  setActivePage: (val: number) => void
  positionMore: { top: number; left: number }
  setIsOpen: (val: boolean) => void
}

export const SubMenuMore: React.FC<ISubMenuMoreProps> = ({
  isMoreOpen,
  setIsMoreOpen,
  motionElemMoreRef,
  hiddenItems,
  activePage,
  setActivePage,
  positionMore,
  setIsOpen,
}) => {
  const search = useContext(SearchContext)

  const ulVariants2: Variants = {
    dropdownOpenMore: {
      clipPath: 'inset(0% 0% 0% 0% round 8px)',
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.15,
        delayChildren: 0.15,
        staggerChildren: 0.05,
      },
    },
    dropdownCloseMore: {
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
    dropdownOpenMore: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 600, damping: 30, mass: 0.5 },
      //transition: {stiffness: 300, damping: 24, duration: 0.3}
    },
    dropdownCloseMore: {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(20px)',
      transition: { duration: 0.1 },
    },
  }

  const toggleDropdownMore = (
    // event: React.MouseEvent<HTMLLIElement>,
    index: number,
  ) => {
    //event.preventDefault()
    // const nameCat = event.currentTarget.textContent

    // console.log('event type:', event?.type)
    // // console.log('event target:', event?.target?.tagName);
    // console.log('event currentTarget:', event?.currentTarget?.tagName)

    // // Проверим, есть ли href у элемента
    // const hasHref = event?.currentTarget?.hasAttribute?.('href')
    // console.log('has href:', hasHref)

    // // Только если есть href И это не NavLink
    // if (hasHref && !event?.currentTarget?.className?.includes?.('navLink')) {
    //   event.preventDefault()
    //   console.log('preventDefault вызван')
    // }

    console.log('toggleChild')
    if (typeof index === 'number' && index + 2 !== activePage) {
      setActivePage(index + 2)
      if (isMoreOpen) {
        console.log('toggleChild-2')
        setIsMoreOpen(false)
      }
      search.clearSearch()
    }
  }

  return (
    <motion.div
      className={styles.moreDropdown}
      key={`moreDropdownMore-${isMoreOpen}`}
      ref={motionElemMoreRef} // для клика вне области списка
      // exit={{ opacity: 0, y: 20 }}
      // transition={{ duration: 0.3 }}
      initial="dropdownCloseMore"
      animate={isMoreOpen ? 'dropdownOpenMore' : 'dropdownCloseMore'}
      // animate="dropdownOpenMore"
      exit="dropdownCloseMore"
      variants={ulVariants2}
      // onAnimationComplete={(definition) => {
      //   if (definition === 'dropdownOpenMore') {
      //     // Перед открытием подменю закрываем подменюменю posts
      //     setIsOpen(false)
      //   }
      // }}
      onAnimationStart={(definition) => {
        if (definition === 'dropdownOpenMore') {
          // Перед открытием подменю закрываем подменюменю posts
          setIsOpen(false)
        }
      }}
      style={{
        top: `${positionMore.top + 12}px`,
        left: `${positionMore.left - 22}px`,
      }}
    >
      <ul className={styles.dropdownContent}>
        {hiddenItems.length > 0 &&
          hiddenItems.map((item, index) => (
            <motion.div
              key={`hidden-${index}`}
              variants={itemVariants2}
              aria-checked={activePage === index + 2}
              onClick={() => {
                if (activePage !== index + 2) toggleDropdownMore(index)
              }}
              style={{ position: 'relative', paddingBottom: '3px' }}
            >
              {activePage === index + 2 && (
                <motion.div
                  layoutId={`hidden-${index}`}
                  style={{
                    width: '80%',
                    height: '2px',
                    position: 'absolute',
                    bottom: '0px',
                    // transform: 'translateY(50%)',
                    // top: '100%',
                    // marginTop: '-2px',
                    left: '10%',
                    backgroundColor: 'red',
                  }}
                />
              )}
              {item}
            </motion.div>
          ))}
      </ul>
    </motion.div>
  )
}
