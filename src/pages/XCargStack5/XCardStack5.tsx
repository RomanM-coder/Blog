import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LazyImage } from '../../components/LazyImage/LazyImage.tsx'
import image1 from '../../assets/static/puzzle.svg'
import image2 from '../../assets/static/code-mobile.svg'
import image3 from '../../assets/static/search-document.svg'
import image4 from '../../assets/static/piechart.svg'
import styles from './XCardStack5.module.css'

interface XCardStack5Props {
  readyLoad: boolean
}

export const XCardStack5: React.FC<XCardStack5Props> = ({ readyLoad }) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const [xScreen, setXScreen] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()
  const xScreenMotion = useMotionValue(xScreen)
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  }) // Отслеживаем положение скролла

  console.log('🔴 XCardStack5 rendered')

  const cards = [
    {
      title: t('xCardStack.card1.title'),
      text: t('xCardStack.card1.text'),
      image: image1,
    },
    {
      title: t('xCardStack.card2.title'),
      text: t('xCardStack.card2.text'),
      image: image2,
    },
    {
      title: t('xCardStack.card3.title'),
      text: t('xCardStack.card3.text'),
      image: image3,
    },
    {
      title: t('xCardStack.card4.title'),
      text: t('xCardStack.card4.text'),
      image: image4,
    },
  ]

  const elementRefs = useRef(cards.map(() => React.createRef<HTMLDivElement>()))

  const positionElement = (index: number) => {
    const element = elementRefs.current[index].current
    if (element && containerRef.current) {
      // const rect = element.getBoundingClientRect()
      // const elementTop = rect.top + window.scrollY
      const elementTop = element.offsetTop
      const height = element.offsetHeight

      const start = elementTop - 500
      const end = start + height //rect.height

      return { start, end }
    }
  }

  useEffect(() => {
    console.log('📈 Effect triggered', {
      // isMenuVisible,
      // lastScrollY: lastScrollYRef.current,
    })
    let lastScrollY = window.scrollY
    let rafId: number | null = null
    // let lastScrollY = lastScrollYRef.current

    const updateScreenWidth = () => {
      // const innerWidth = window.innerWidth
      setXScreen(window.innerWidth)
    }

    const getInitialActiveIndex = (): Promise<number> => {
      return new Promise((resolve) => {
        const threshold = window.innerHeight / 3 // Пороговая линия на 1/3 от верха
        let closestIndex = 0
        let minDistance = Infinity

        rafId = requestAnimationFrame(() => {
          for (let i = 0; i < elementRefs.current.length; i++) {
            const element = elementRefs.current[i].current
            if (!element) continue

            const rect = element.getBoundingClientRect()
            const distance = Math.abs(rect.top - threshold)

            if (distance < minDistance) {
              minDistance = distance
              closestIndex = i
            }
          }
          resolve(closestIndex) // ← Возвращаем результат
        })
      })
    }

    const handleScroll = async () => {
      // console.log('🔄 handleScroll called', {
      //   // isMenuVisible,
      //   lastScrollY: lastScrollY,
      //   windowScrollY: window.scrollY,
      // })
      console.log('🎯 XCardStack5 handleScroll called')
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = currentScrollY
      // setScrollDirection(isMenuVisible ? 'up' : 'down')
      // lastScrollY = lastScrollYRef.current

      const activeElementIndex = await getInitialActiveIndex()
      console.log('🎯 XCardStack5 Active element:', activeElementIndex)

      // 🔹 Логика обновления состояний
      if (scrollDirection === 'down') {
        if (activeElementIndex !== -1 && activeElementIndex !== null) {
          setLastActiveIndex(activeElementIndex)
          setActiveIndex(activeElementIndex)
        } else if (activeElementIndex === -1 && lastActiveIndex !== null) {
          setActiveIndex(lastActiveIndex)
        }
      } else if (scrollDirection === 'up') {
        if (activeElementIndex !== -1 && activeElementIndex !== null) {
          setActiveIndex(activeElementIndex)
        } else {
          setActiveIndex(null)
        }
      }
    }

    updateScreenWidth()

    // Запускаем инициализацию после полной загрузки страницы
    if (readyLoad) {
      // 🔹 Определяем активный элемент
      // const initialIndex = getInitialActiveIndex()
      // setLastActiveIndex(initialIndex)
      // setActiveIndex(initialIndex)

      // Инициализация с правильным await
      ;(async () => {
        const initialIndex = await getInitialActiveIndex()
        setLastActiveIndex(initialIndex)
        setActiveIndex(initialIndex)
        handleScroll()
      })()

      // Запускаем обработчик скролла
      // handleScroll()
    }

    window.addEventListener('scroll', handleScroll)
    console.log('✅ XCardStack5 event listener added')
    window.addEventListener('resize', updateScreenWidth)

    return () => {
      //   // if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      console.log('❌ XCardStack5 event listener removed')
      window.removeEventListener('resize', updateScreenWidth)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [readyLoad])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      console.log('📜 XCardStack5 scrollY:', latest)
    })
    return () => unsubscribe()
  }, [scrollY])

  useEffect(() => {
    xScreenMotion.set(xScreen)
  }, [xScreen])

  return (
    <div className={styles.cardContainer} ref={containerRef}>
      <h2 className={styles.h2Header}>{t('xCardStack.context1')}</h2>

      <div className={styles.cards}>
        <div className={styles.h3Header}>
          <h3>{t('xCardStack.context2')}</h3>
        </div>
        <div className={styles.cardsSliding}>
          {cards.map((card, index) => {
            const range = positionElement(index)
            console.log(`📍 Card ${index} range:`, range) // что здесь?

            const start = range?.start ?? 0
            const end = range?.end ?? 1
            console.log(`📍 Card ${index} start:${start} end:${end}`)
            // Рассчитываем translateX для каждой карточки
            const translateX = useTransform(
              scrollY,
              // lastScrollYRef.current,
              [positionElement(index)?.start!, positionElement(index)?.end!],
              [xScreen, 0],
            )
            // console.log(`🎨 Card ${index}:`, {
            //   scrollY: scrollY,
            //   posStart: positionElement(index)?.start!,
            //   posEnd: positionElement(index)?.end!,
            //   xScreen: xScreen,
            //   translateX: translateX.get(),
            //   activeIndex,
            //   isActive: index === activeIndex,
            //   isBeforeActive: activeIndex !== null && index < activeIndex,
            //   isAfterActive: activeIndex !== null && index > activeIndex,
            // })
            // useMotionValueEvent(scrollY, 'change', (latest) => {
            //   // console.log(`🎨 Card ${index} - scrollY:`, latest)
            // })

            // useMotionValueEvent(translateX, 'change', (latest) => {
            //   // console.log(`🎨 Card ${index} - translateX:`, latest)
            // })
            // 🔥 ОТЛАДКА АНИМАЦИИ
            useEffect(() => {
              const unsubscribe = translateX.on('change', (latest) => {
                console.log(
                  `🎯 Card ${index} translateX:`,
                  latest,
                  'scrollY:',
                  scrollY.get(),
                )
              })
              return () => unsubscribe()
            }, [translateX, index])

            return (
              <motion.div
                key={index}
                ref={elementRefs.current[index]}
                className={
                  styles.cardSliding +
                  `${index === activeIndex ? ' ' + styles.active : ''}`
                }
              >
                <motion.div
                  className={styles.cardBg}
                  // style={{
                  //   transform:
                  //     index % 2 === 0
                  //       ? index === activeIndex
                  //         ? `translateX(${translateX.get()}px) translateZ(0px)`
                  //         : index < activeIndex!
                  //           ? 'translateX(0px) translateZ(0px)'
                  //           : 'translateX(105%) translateZ(0px)'
                  //       : index === activeIndex
                  //         ? `translateX(${-translateX.get()}px) translateZ(0px)`
                  //         : index < activeIndex!
                  //           ? 'translateX(0px) translateZ(0px)'
                  //           : 'translateX(-105%) translateZ(0px)',
                  // }}
                  style={{
                    transform: useTransform(() => {
                      const tx = translateX.get()
                      return index % 2 === 0
                        ? index === activeIndex
                          ? `translateX(${tx}px) translateZ(0px)`
                          : index < activeIndex!
                            ? 'translateX(0px) translateZ(0px)'
                            : 'translateX(105%) translateZ(0px)'
                        : index === activeIndex
                          ? `translateX(${-tx}px) translateZ(0px)`
                          : index < activeIndex!
                            ? 'translateX(0px) translateZ(0px)'
                            : 'translateX(-105%) translateZ(0px)'
                    }),
                  }}
                  animate={{ transition: { duration: 0.01 } }}
                ></motion.div>
                <div
                  className={styles.cardSlider}
                  style={{
                    width:
                      index % 2 === 0
                        ? '100vw'
                        : `${xScreen - translateX.get() - 54}px`, // исправил 41 на 54
                    zIndex: index % 2 === 0 ? 1 : 2,
                  }}
                >
                  <div className={styles.cardTextArea}>
                    <div className={styles.cardContent}>
                      <div
                        className={styles.cardText}
                        style={{
                          paddingLeft: index % 2 === 0 ? '20px' : '0px',
                        }}
                      >
                        <h2 style={{ textTransform: 'uppercase' }}>
                          {card.title}
                        </h2>
                        <p style={{ width: index % 2 === 0 ? '100%' : '80%' }}>
                          {card.text}
                        </p>
                      </div>
                      <div className={styles.cardImage}>
                        <LazyImage
                          src={card.image}
                          alt={card.title}
                          className={styles.classImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={styles.cardSlider + ` ${styles.cardSliderInverse}`}
                  style={{
                    width:
                      index % 2 === 0 ? `${translateX.get() + 40}px` : '100%',
                    zIndex: index % 2 === 0 ? 2 : 1,
                  }}
                >
                  {/* <noindex> */}
                  {/* <noscript> */}
                  <div
                    data-content="noindex-replacement"
                    className={styles.cardTextArea}
                  >
                    <div className={styles.cardContent}>
                      <div
                        className={styles.cardText}
                        style={{
                          paddingLeft: index % 2 === 0 ? '20px' : '0px',
                        }}
                      >
                        <h2 style={{ textTransform: 'uppercase' }}>
                          {card.title}
                        </h2>
                        <p style={{ width: index % 2 === 0 ? '100%' : '80%' }}>
                          {card.text}
                        </p>
                      </div>
                      <div className={styles.cardImage}>
                        <LazyImage
                          src={card.image}
                          alt={card.title}
                          className={styles.classImage}
                        />
                      </div>
                    </div>
                  </div>
                  {/* </noscript> */}
                  {/* </noindex> */}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <h3 className={styles.h3Footer}>{t('xCardStack.context3')}</h3>
    </div>
  )
}
