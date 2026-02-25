import React, { useEffect, useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import styles from './MenuItem.module.css'

interface IMenuItemHamburgerProps {
  item: React.ReactNode
  index: number
  activePage: number
  isVertical?: boolean
  getKey: string
  width: number | undefined
  itemlength?: number
  setMenuItemRef: (index: number, el: HTMLDivElement | null) => void
  setIsNavBarHamburgerAnimationComplete: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

export const MenuItemHamburger: React.FC<IMenuItemHamburgerProps> = ({
  item,
  index,
  activePage,
  isVertical = false,
  getKey,
  width,
  setMenuItemRef,
  setIsNavBarHamburgerAnimationComplete,
}) => {
  const itemRef = useRef<HTMLDivElement>(null)
  // Создаем отдельный ref для индикатора
  const indicatorRef = useRef<HTMLDivElement>(null)

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      color: activePage === index ? 'rgb(255, 0, 0)' : '#fff',
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 30,
        mass: 0.5,
        duration: 0.15,
      },
    },
    closed: {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(20px)',
      color: 'rgb(255, 255, 255)',
      transition: { duration: 0.1, when: 'afterChildren' },
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

  // const triggerShowRedLine =
  //   itemlength === 6
  //     ? activePage === index
  //     : index !== 2
  //       ? activePage === index && index !== itemlength! - 1
  //       : activePage === 2 || activePage === 3 || activePage === 4

  // Регистрируем ref после монтирования
  useEffect(() => {
    // Передаем в родительский компонент ref индикатора, а не всего элемента
    if (setMenuItemRef && indicatorRef.current) {
      setMenuItemRef(index, indicatorRef.current)
    }

    // Очистка при размонтировании
    return () => {
      if (setMenuItemRef) {
        setMenuItemRef(index, null)
      }
    }
  }, [index, setMenuItemRef])

  // Дебаг: логируем изменение activePage
  // useEffect(() => {
  //   console.log(
  //     `MenuItem ${index}: activePage = ${activePage}, should animate: ${activePage === index}`,
  //   )
  // }, [activePage, index])

  return (
    <div
      ref={itemRef}
      style={{
        position: 'relative',
        // margin: marginWidth(),
        width: 'fitContent',
        margin: '0 auto',
        //display: 'inline',
        // Контейнер для всего элемента меню
      }}
    >
      <motion.div
        // ref={motionElemHamburgerRef}
        // key={`menu-item-${index}-${activePage}`}
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
          fontWeight: activePage === index ? 700 : 400,
        }}
        variants={itemVariants}
        onAnimationStart={(definition) => {
          if (definition === 'open') {
            setIsNavBarHamburgerAnimationComplete(false)
            console.log('onAnimationStart-open')
          }
        }}
        onAnimationComplete={(definition) => {
          if (definition === 'open') {
            setIsNavBarHamburgerAnimationComplete(true)
            console.log('onAnimationComplete-open')
          }
        }}
        // onUpdate={(latest) => {
        //   // Для отладки: отслеживаем изменения значений анимации
        //   console.log(`📊 MenuItem ${index} update:`, latest)
        // }}
      >
        {item}
      </motion.div>
      {/* Индикатор ВНЕ анимируемого элемента */}
      <div
        ref={indicatorRef}
        style={{
          position: 'absolute',
          // Растягиваем на 80% ширины родительского контейнера
          left: '10%',
          right: '10%',
          // Размещаем внизу контейнера
          bottom: '0',
          height: '2px',
          // Фон для отладки (потом удалите)
          // backgroundColor: 'rgba(0, 255, 0, 0.3)',
          // Делаем невидимым
          opacity: 0,
          pointerEvents: 'none',
          // Гарантируем, что индикатор не влияет на размеры
          visibility: 'hidden',
          // zIndex: 1000, // Для отладки
        }}
        aria-hidden="true"
      />
    </div>
  )
}
