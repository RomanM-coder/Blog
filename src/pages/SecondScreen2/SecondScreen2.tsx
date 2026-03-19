import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import styles from './SecondScreen2.module.css'

interface ISecondScreen2 {
  readyLoad: boolean
}

export const SecondScreen2: React.FC<ISecondScreen2> = ({ readyLoad }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null) // Текущий активный индекс
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const refs = useRef<(HTMLDivElement | null)[]>([]) // Массив рефов для каждого элемента
  const rafId = useRef<number | null>(null)
  const lastScrollY = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Используем ref для хранения актуального значения activeIndex
  const activeIndexRef = useRef<number | null>(null)

  const { t } = useTranslation()

  // Создаем реф для элемента, который хотим анимировать
  const h2Ref = useRef<HTMLHeadingElement>(null)

  // Настройка анимации скролла для h2 элемента
  const { scrollYProgress } = useScroll({
    target: h2Ref,
    offset: ['start end', 'end start'],
  })

  // Создаем spring-анимацию для более плавного эффекта
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Преобразуем прогресс скролла в значения масштаба
  const scale = useTransform(
    smoothScroll,
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    [0.9, 0.96, 1.03, 1.07, 1.08, 1.08, 1.08, 1.07, 1.03, 0.96, 0.9],
  )

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const title = [
    t('secondScreen.card1.name'),
    t('secondScreen.card2.name'),
    t('secondScreen.card3.name'),
    t('secondScreen.card4.name'),
    t('secondScreen.card5.name'),
    t('secondScreen.card6.name'),
    t('secondScreen.card7.name'),
    t('secondScreen.card8.name'),
  ]
  const description = [
    t('secondScreen.card1.description'),
    t('secondScreen.card2.description'),
    t('secondScreen.card3.description'),
    t('secondScreen.card4.description'),
    t('secondScreen.card5.description'),
    t('secondScreen.card6.description'),
    t('secondScreen.card7.description'),
    t('secondScreen.card8.description'),
  ]

  const findActiveElement = () => {
    const viewportCenter = window.innerHeight / 2
    let closestIndex = -1
    let minDistance = Infinity

    // Кэшируем window.innerHeight
    const innerHeight = window.innerHeight

    refs.current.forEach((el, index) => {
      if (!el) return

      const rect = el.getBoundingClientRect()
      const rectTop = rect.top
      const rectBottom = rect.bottom
      const rectHeight = rect.height

      // Убедимся, что элемент хотя бы частично в видимой области
      if (rectTop > innerHeight || rectBottom < 0) {
        return
      }

      // Условие: элемент полностью в пределах viewport
      const isFullyVisible =
        rectTop >= 0 && // верх не скрыт
        rectBottom <= innerHeight // низ не скрыт

      const elementCenter = rectTop + rectHeight / 2
      const distance = Math.abs(elementCenter - viewportCenter)

      // Проверяем, что элемент в пределах ±150px от центра
      if (distance <= 150) {
        if (distance < minDistance && isFullyVisible) {
          minDistance = distance
          closestIndex = index
        }
      }
    })

    return closestIndex !== -1 ? closestIndex : null
  }

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY.current
      lastScrollY.current = currentScrollY

      // Сохраняем направление скролла
      setScrollDirection(isScrollingDown ? 'down' : 'up')

      const newActiveIndex = findActiveElement()

      // Логика переключения
      if (newActiveIndex != null) {
        if (newActiveIndex !== activeIndexRef.current) {
          if (
            (isScrollingDown && newActiveIndex > activeIndexRef.current!) ||
            (!isScrollingDown && newActiveIndex < activeIndexRef.current!)
          ) {
            setActiveIndex(newActiveIndex)
          }
        }
      } else {
        setActiveIndex(null)
      }

      if (newActiveIndex != null && activeIndexRef.current === null) {
        setActiveIndex(newActiveIndex)
      }
    })
  }, [])

  useEffect(() => {
    // 🔹 Инициализация
    // const init = () => {
    //   const newActiveIndex = findActiveElement()

    //   if (newActiveIndex !== null) {
    //     setActiveIndex(newActiveIndex)
    //   }
    //   // Начинаем слушать скролл
    //   window.addEventListener('scroll', handleScroll, { passive: true })
    // }
    // const initTimeout = setTimeout(() => init(), 600)

    if (readyLoad) {
      const newActiveIndex = findActiveElement()

      if (newActiveIndex !== null) {
        setActiveIndex(newActiveIndex)
      }
      // Начинаем слушать скролл
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      // clearTimeout(initTimeout)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, readyLoad])

  return (
    <div ref={containerRef} className={styles.landingContainer}>
      <motion.h2
        ref={h2Ref}
        style={{ scale, padding: '30px 40px' }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {t('secondScreen.header')}
      </motion.h2>

      {title.map((name, index) => {
        const elRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
          if (elRef.current) {
            refs.current[index] = elRef.current
          }
          return () => {
            refs.current[index] = null
          }
        }, [index])

        return (
          <div
            key={index}
            ref={elRef}
            data-index={index}
            className={`${styles.screenWrapper} ${
              activeIndex === index ? styles.active : ''
            }
              ${
                activeIndex === index
                  ? scrollDirection === 'down'
                    ? styles.scrollDown
                    : styles.scrollUp
                  : ''
              }
            }`}
          >
            <p
              style={{
                fontSize: activeIndex === index ? '24px' : '18px',
                textTransform: activeIndex === index ? 'uppercase' : 'none',
                color: activeIndex === index ? 'navy' : 'black',
              }}
            >
              {name}
            </p>
            {activeIndex === index && (
              <p
                className={styles.array2Description}
                style={{ fontSize: activeIndex === index ? '22px' : '16px' }}
              >
                {description[index]}
              </p>
            )}
          </div>
        )
      })}
      <h3>{t('secondScreen.end')}</h3>
      <h3>{t('secondScreen.end')}</h3>
    </div>
  )
}
