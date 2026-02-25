// ActiveLine.tsx (отдельный компонент)
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '../../useGlobalState'
import { useTranslation } from 'react-i18next'

interface ActiveLineProps {
  activePage: number
  menuItemsRefs: React.MutableRefObject<Map<number, HTMLDivElement>>
  isVisible?: boolean
  isOpenHamburger: boolean
  width: number
}

export const ActiveLine: React.FC<ActiveLineProps> = ({
  activePage,
  menuItemsRefs,
  isVisible = true,
  isOpenHamburger,
  width,
}) => {
  const { i18n } = useTranslation()
  const [isAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin] = useGlobalState('isAdmin')
  const [position, setPosition] = useState({ left: 0, width: 0 })
  const [positionHamb, setPositionHamb] = useState({
    left: 0,
    width: 0,
    top: 0,
  })
  // const [shouldAnimate, setShouldAnimate] = useState(false)

  const isUpdatingRef = useRef(false)
  // const hasMountedRef = useRef(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  const lastWidthRef = useRef(window.innerWidth)

  const updatePosition = useCallback(() => {
    console.log('🔍 updatePosition called', {
      activePage,
      isAuthenticated,
      time: Date.now(),
      availableRefs: Array.from(menuItemsRefs.current.keys()),
      refsCount: menuItemsRefs.current.size,
    })

    if (isUpdatingRef.current) return
    isUpdatingRef.current = true

    console.log('Resize event fired!', {
      width: window.innerWidth,
      height: window.innerHeight,
      time: Date.now(),
    })
    const measurementTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        let itemMenu = activePage
        if (width < 1200 && width > 768) {
          if (activePage === 2 || activePage === 3 || activePage === 4)
            itemMenu = 2
        }
        const activeElement = menuItemsRefs.current.get(itemMenu)

        if (activeElement) {
          const rect = activeElement.getBoundingClientRect()
          // offsetWidth возвращает исходную ширину БЕЗ учёта transform
          // const originalWidth = activeElement.offsetWidth
          // const originalHeight = activeElement.offsetHeight
          // const originalLeft = activeElement.offsetLeft
          // const originalTop = activeElement.offsetTop

          // console.log(
          //   'ActiveLine --------------------------- позиция элемента:',
          //   {
          //     left: rect.left,
          //     width: rect.width,
          //     top: rect.top,
          //     page: activePage,
          //   },
          // )

          // 2. Учитываем скролл страницы
          const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft
          const scrollY =
            window.pageYOffset || document.documentElement.scrollTop

          // 3. Получаем позицию элемента в абсолютных координатах документа
          const absoluteLeft = rect.left + scrollX
          const absoluteTop = rect.top + scrollY

          if (width < 768) {
            // setPositionHamb({
            //   left: rect.left + rect.width * 0.1,
            //   width: rect.width, // * 0.8,
            //   top: rect.top,
            // })

            const lineWidth = rect.width // * 0.8
            const lineLeft = absoluteLeft + (rect.width - lineWidth) / 2

            setPositionHamb({
              left: lineLeft,
              width: lineWidth,
              top: absoluteTop + rect.height - 3,
            })
          } else {
            const lineWidth = rect.width * 0.8
            const lineLeft = absoluteLeft + (rect.width - lineWidth) / 2

            setPosition({
              left: lineLeft,
              width: lineWidth,
            })

            // setPosition({
            //   left: rect.left + rect.width * 0.1,
            //   width: rect.width, //* 0.8,
            // })
          }
          // Включаем анимацию только после первого обновления позиции
          // if (!hasMountedRef.current) {
          // setTimeout(() => {
          // setShouldAnimate(true)
          // hasMountedRef.current = true
          // }, 400) // время анимации появления NavBar
          // }
        } else {
          console.warn(
            'ActiveLine - элемент не найден для страницы:',
            activePage,
          )
          console.log('Доступные рефы:', Object.keys(menuItemsRefs.current))
        }

        isUpdatingRef.current = false
      })
    }, 150) // Ждём завершения анимации
    return () => clearTimeout(measurementTimer)
  }, [
    activePage,
    menuItemsRefs,
    isAuthenticated,
    isAdmin,
    width,
    isOpenHamburger,
    i18n.language,
  ])

  // 1. Инициализация при монтировании
  useEffect(() => {
    // Ждем, пока DOM полностью обновится
    const initTimer = setTimeout(
      () => {
        updatePosition()
      },
      isAuthenticated ? 350 : 350,
    )

    return () => clearTimeout(initTimer)
  }, [updatePosition, isAuthenticated])

  // Обновляем позицию при ресайзе и скролле
  useEffect(() => {
    if (!isVisible) return

    const handleResize = () => {
      const currentWidth = window.innerWidth
      const widthDiff = Math.abs(currentWidth - lastWidthRef.current)

      if (widthDiff < 3) {
        console.log('ActiveLine: игнорирую микро-изменение', widthDiff, 'px')
        return
      }

      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        updatePosition()
        lastWidthRef.current = currentWidth
      }, 200)
    }

    const handleScroll = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        updatePosition()
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    updatePosition,
    isVisible,
    isAuthenticated,
    width,
    isOpenHamburger,
    i18n.language,
  ])

  //  Если NavBar скрыт, скрываем и линию
  if (!isVisible) {
    return null
  }
  if (width < 768)
    return (
      <motion.div
        layoutId="activeItem-hamb"
        initial={false}
        animate={{
          left: positionHamb.left,
          width: positionHamb.width,
          top: positionHamb.top,
          // opacity: shouldAnimate ? 1 : 0,
        }}
        style={{
          position: 'absolute',
          top: '45px',
          height: '2px',
          backgroundColor: 'red',
          zIndex: 12,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 30,
          mass: 0.8,
        }}
      />
    )
  else
    return (
      <motion.div
        layoutId="activeItem"
        initial={false}
        animate={{
          left: position.left,
          width: position.width,
          // opacity: shouldAnimate ? 1 : 0,
        }}
        style={{
          position: 'fixed',
          top: '45px',
          height: '2px',
          backgroundColor: 'red',
          zIndex: 12,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 30,
          mass: 0.8,
        }}
      />
    )
}
