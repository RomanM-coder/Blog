import React, { useEffect, useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import styles from './MenuItem.module.css'

interface IMenuItemProps {
  item: React.ReactNode
  index: number
  activePage: number
  isVertical?: boolean
  getKey: string
  width: number | undefined
  itemlength?: number
  setMenuItemRef: (index: number, el: HTMLLIElement | null) => void
}

export const MenuItem: React.FC<IMenuItemProps> = ({
  item,
  index,
  activePage,
  isVertical = false,
  getKey,
  width,
  itemlength,
  setMenuItemRef,
}) => {
  const itemRef = useRef<HTMLLIElement>(null)

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      color: activePage === index ? 'rgb(255, 0, 0)' : '#fff',
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(20px)',
      color: 'rgb(255, 255, 255)',
      transition: { duration: 0.2, when: 'afterChildren' },
    },
  }
  const marginWidth = () => {
    if (width! > 1300) {
      return '0 0.5rem'
    } else if (width! > 1200 && width! < 1300) {
      return '0 0.3rem'
    } else if (width! > 1100 && width! < 1200) {
      return '0 0.1rem'
    } else if (width! > 1100 && width! < 0) return '0 0'
  }

  const triggerShowRedLine =
    itemlength === 6
      ? activePage === index
      : index !== 2
        ? activePage === index && index !== itemlength! - 1
        : activePage === 2 || activePage === 3 || activePage === 4

  // Регистрируем ref после монтирования
  useEffect(() => {
    if (setMenuItemRef && itemRef.current) {
      setMenuItemRef(index, itemRef.current)
    }

    // Очистка при размонтировании
    return () => {
      if (setMenuItemRef) {
        setMenuItemRef(index, null)
      }
    }
  }, [index, setMenuItemRef])

  return (
    <motion.li
      ref={itemRef}
      key={getKey}
      className={
        activePage === index
          ? `${isVertical ? styles.mainMenuVert : styles.mainMenu} activeLine`
          : isVertical
            ? styles.mainMenuVert
            : styles.mainMenu
      }
      style={{
        margin: marginWidth(),
        textAlign: 'center',
        position: 'relative',
        fontWeight: triggerShowRedLine ? 700 : 400,
      }}
      variants={itemVariants}
    >
      {item}
    </motion.li>
  )
}
