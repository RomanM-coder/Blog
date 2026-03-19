import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { LazyImage } from '../../components/LazyImage/LazyImage.tsx'
import magnolia from '../../assets/static/magnolia-flower-clipart-md.webp'
import pinkFlower from '../../assets/static/pink-flower-clipart-md.webp'
import narcissus from '../../assets/static/narcissus-clipart-md.webp'
import bellFlower from '../../assets/static/bell-flower-clipart-md.webp'
// import pinkTulip from '/src/assets/pink-tulip-clipart-md.png'
// import peonies from '/src/assets/peonies-clipart-md.png'
import styles from './Variant3.module.css'

interface IVariant3 {
  readyLoad: boolean
}

export const Variant3: React.FC<IVariant3> = ({ readyLoad }) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cardHeights, setCardHeights] = useState<number[]>([])
  const { width = 0 } = useScreenSize()
  const { t } = useTranslation()
  const [isContainerReady, setIsContainerReady] = useState(false)

  // Конфигурация карточек

  const cards = [
    {
      header: t('variant2.header1'),
      img: magnolia,
      description: t('variant2.card1'),
    },
    {
      header: t('variant2.header2'),
      img: pinkFlower,
      description: t('variant2.card2'),
    },
    {
      header: t('variant2.header3'),
      img: narcissus,
      description: t('variant2.card3'),
    },
    {
      header: t('variant2.header4'),
      img: bellFlower,
      description: t('variant2.card4'),
    },
    // {
    //   header: t('variant2.header5'),
    //   img: pinkTulip,
    //   description: t('variant2.card5'),
    // },
    // {
    //   header: t('variant2.header6'),
    //   img: peonies,
    //   description: t('variant2.card6'),
    // },
  ]

  // Инициализируем useScroll
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: isContainerReady ? containerRef : undefined,
    offset: ['start end', 'end start'],
  })

  // Создаем Motion значения
  const scale0 = useTransform(scrollYProgress1, [0.3, 1], [1, 0])
  const scale1 = useTransform(scrollYProgress1, [0.4, 1], [1, 0])
  const scale2 = useTransform(scrollYProgress1, [0.6, 1], [1, 0])
  const scale3 = useTransform(scrollYProgress1, [0.9, 1], [1, 1])
  // const scale4 = useTransform(scrollYProgress1, [0.9, 1], [1, 1])
  // const scale5 = useTransform(scrollYProgress1, [0.9, 1], [1, 1])
  const scale = [scale0, scale1, scale2, scale3]

  const isUpdatingRef = useRef(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  const lastWidthRef = useRef(window.innerWidth)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updateCardHeights = () => {
      // Предотвращаем множественные одновременные вызовы
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true
      requestAnimationFrame(() => {
        const newHeights = cardRefs.current.map((ref) =>
          ref ? ref.getBoundingClientRect().height : 0,
        )

        // Проверяем, изменились ли высоты
        const hasChanged = newHeights.some((h, i) => {
          return h !== cardHeights[i]
          // console.log(`Scroll progress= ${h}, ${i}`, scrollYProgress1)
        })
        // console.log(`Scroll progress= ${h}, ${i}`, scrollYProgress1)
        if (hasChanged) {
          setCardHeights(newHeights)
        }
        isUpdatingRef.current = false
      })
    }

    // Оптимизированная версия для resize
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const widthDiff = Math.abs(currentWidth - lastWidthRef.current)

      // Игнорируем микро-изменения (< 5px)
      if (widthDiff < 5) {
        console.log('Variant3: ignoring micro-resize', widthDiff, 'px')
        return
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateCardHeights()
        lastWidthRef.current = currentWidth
      }, 200) // Дебаунс 200ms
    }

    // Оптимизированная версия для scroll
    const handleScroll = () => {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        updateCardHeights()
      }, 30) // Дебаунс 30ms для скролла
    }

    updateCardHeights()
    // Запуск с задержкой, чтобы гарантировать рендер
    const timeoutId = setTimeout(updateCardHeights, 300)

    // Также обновляем при скролле и ресайзе
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // Используем IntersectionObserver для отслеживания появления элементов
    // const observer = new IntersectionObserver(updateCardHeights, {
    //   threshold: 0.1,
    //   rootMargin: '100px',
    // })

    // cardRefs.current.forEach((ref) => {
    //   if (ref) observer.observe(ref)
    // })

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(resizeTimeoutRef.current)
      clearTimeout(scrollTimeoutRef.current)

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      // observer.disconnect()
    }
  }, [cards.length, width])

  useEffect(() => {
    const init = () => {
      if (containerRef.current) {
        setIsContainerReady(true)
      }
    }
    const initId = setTimeout(init, 100)
    return () => {
      clearTimeout(initId)
    }
  }, [])

  useLayoutEffect(() => {
    // Запускаем инициализацию после полной загрузки страницы
    if (readyLoad && containerRef.current) setIsContainerReady(true)
  }, [readyLoad])

  // useEffect(() => {
  //   const unsubscribe = scrollYProgress1.on('change', (latest) => {
  //     console.log('Scroll progress= ', latest)
  //   })

  //   return () => unsubscribe()
  // }, [scrollYProgress1])

  // // Отслеживаем изменения scale
  // useEffect(() => {
  //   const unsubscribes = scale.map((s, index) =>
  //     s.on('change', (latest) => {
  //       console.log(`Scale ${index}= `, latest)
  //       console.log(`containerRef.current=  ${containerRef.current}`)
  //     })
  //   )
  //   return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
  // }, [scale])

  return (
    <section className={styles.cardContainer}>
      <div className={styles.cards} ref={containerRef}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.titleSection}>{t('variant2.header')}</h2>
        </div>

        {cards.map((card, index) => {
          const elRef = useRef<HTMLDivElement>(null)
          cardRefs.current[index] = elRef.current

          // const { scaleRange, offset, k } = getCardSettings()
          // const accumulatedHeight = cardHeights
          //   .slice(0, index)
          //   .reduce((a, b) => a + b, 0)

          // console.log('index', index, ' accumulatedHeight=', accumulatedHeight)
          // const scale = useTransform(
          //   scrollY,
          //   [
          //     accumulatedHeight + offset * (k / 2),
          //     accumulatedHeight + offset * k,
          //   ],
          //   scaleRange
          // )

          return (
            <motion.div
              key={index}
              ref={elRef}
              className={styles.cardWrapper}
              // className={`${styles.cardWrapper} ${
              //   index === activeIndex ? styles.active : ''
              // }`}
              style={{
                // scale: index < (activeIndex ?? Infinity) ? scale : 1,
                scale: scale[index],
                marginTop: index !== 0 ? '-30px' : '0px',
                zIndex: index + 1,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <div className={styles.cardContent}>
                <div className={styles.leftSection}>
                  <div className={styles.cardNumber}>{index + 1}</div>
                  <h2 className={styles.cardTitle}>{card.header}</h2>
                </div>
                <div className={styles.cardImageSection}>
                  {/* <Suspense fallback={<div>Загрузка...</div>}>
                  <img
                    className={styles.cardImage}
                    src={card.img}
                    alt={card.header}
                    loading='lazy'
                  /> 
                  </Suspense> */}
                  <LazyImage
                    src={card.img}
                    alt={card.header}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.rightSection}>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
