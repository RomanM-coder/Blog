import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  useAnimation,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { useTranslation } from 'react-i18next'
import image1 from '../../assets/static/global-assets-and-recovery-01.svg'
import image2 from '../../assets/static/battery-disable.svg'
import image3 from '../../assets/static/calculator.svg'
import image4 from '../../assets/static/first-aid-kit-thin.svg'
import image5 from '../../assets/static/basket-ecommerce-shop.svg'
import image6 from '../../assets/static/home.svg'
import image7 from '../../assets/static/medical-case.svg'
import image8 from '../../assets/static/check-circle-thin.svg'
import image9 from '../../assets/static/shopping-cart-simple-thin.svg'
import image10 from '../../assets/static/chart-line-thin.svg'
// import image11 from '../../assets/static/law.svg'
// import image12 from '../../assets/static/bag-basket-cart.svg'
import image13 from '../../assets/static/eco-ecology-environment-2.svg'
import image14 from '../../assets/static/increase-graph-chart.svg'
import image15 from '../../assets/static/business-finance-corporate-40.svg'
import image16 from '../../assets/static/arrow-right-rounded.svg'
import image17 from '../../assets/static/delivery-truck.svg'
import image18 from '../../assets/static/travel-expenses.svg'
import image19 from '../../assets/static/store.svg'
import image20 from '../../assets/static/shopping-bag2.svg'
import image21 from '../../assets/static/game-controller-thin.svg'
import image22 from '../../assets/static/tick.svg'
// import image23 from '../../assets/static/scales-thin.svg'
// import image24 from '../../assets/static/photo.svg'
// import image25 from '../../assets/static/rounded-square-arrow-indicator-right.svg'
import { LazyImage } from '../../components/LazyImage/LazyImage.tsx'
import styles from './HorizontalPlayer2.module.css'

export const HorizontalPlayer2: React.FC = () => {
  const [whithHeightBlock, setWhithHeightBlock] = useState(170)
  const [whithHeightImg, setWhithHeightImg] = useState(100)
  const [whithHeightText, setWhithHeightText] = useState(60)
  const { width } = useScreenSize() // перерасчет ширин элементов
  const { t } = useTranslation()

  const controls1 = useAnimation()
  const controls2 = useAnimation()

  const images1 = [
    {
      icon: image1,
      text: t('horizontalPlayer.images1.image1'),
    },
    {
      icon: image2,
      text: t('horizontalPlayer.images1.image2'),
    },
    {
      icon: image3,
      text: t('horizontalPlayer.images1.image3'),
    },
    {
      icon: image4,
      text: t('horizontalPlayer.images1.image4'),
    },
    {
      icon: image5,
      text: t('horizontalPlayer.images1.image5'),
    },
    {
      icon: image6,
      text: t('horizontalPlayer.images1.image6'),
    },
    {
      icon: image7,
      text: t('horizontalPlayer.images1.image7'),
    },
    {
      icon: image8,
      text: t('horizontalPlayer.images1.image8'),
    },
    {
      icon: image9,
      text: t('horizontalPlayer.images1.image9'),
    },
    {
      icon: image10,
      text: t('horizontalPlayer.images1.image10'),
    },
  ]

  const images2 = [
    {
      icon: image13,
      text: t('horizontalPlayer.images2.image13'),
    },
    {
      icon: image14,
      text: t('horizontalPlayer.images2.image14'),
    },
    {
      icon: image15,
      text: t('horizontalPlayer.images2.image15'),
    },
    {
      icon: image16,
      text: t('horizontalPlayer.images2.image16'),
    },
    {
      icon: image17,
      text: t('horizontalPlayer.images2.image17'),
    },
    {
      icon: image18,
      text: t('horizontalPlayer.images2.image18'),
    },
    {
      icon: image19,
      text: t('horizontalPlayer.images2.image19'),
    },
    {
      icon: image20,
      text: t('horizontalPlayer.images2.image20'),
    },
    {
      icon: image21,
      text: t('horizontalPlayer.images2.image21'),
    },
    {
      icon: image22,
      text: t('horizontalPlayer.images2.image22'),
    },
  ]

  const gap = 40
  const distance1 = images1.length * (whithHeightBlock + gap)
  const distance2 = images2.length * (whithHeightBlock + gap)

  const x1 = useMotionValue(-distance1)
  const x2 = useMotionValue(0)
  const animationRef1 = useRef<Promise<void> | null>(null)
  const isPausedRef1 = useRef(false)
  const animationRef2 = useRef<Promise<void> | null>(null)
  const isPausedRef2 = useRef(false)

  //Используем новый хук useMotionValueEvent -> для отладки
  useMotionValueEvent(x1, 'change', (value) => {
    x1.set(value)
    // console.log('Current position1:', value)
  })
  // useMotionValueEvent(xPos2, 'change', (value) => {
  //   // x2.set(value)
  //   console.log('Current position2:', value)
  // })

  const handleMouseEnter1 = () => {
    const currentX1 = x1.get()
    console.log('currentX1=', currentX1)
    controls1.stop()
    animationRef1.current = null
    isPausedRef1.current = true
  }

  const handleMouseLeave1 = () => {
    console.log('in onMouseLeave x1=', x1.get())
    if (isPausedRef1.current) {
      isPausedRef1.current = false
      startAnimation1(x1.get())
    }
  }

  const startAnimation1 = (fromX: number) => {
    if (isPausedRef1.current) return

    let startPosition: number
    let endPosition: number
    let duration: number
    if (fromX === 0 || Math.abs(fromX) > distance1) {
      startPosition = 0
      endPosition = -distance1
      duration = 45
    } else if (Math.abs(fromX) < distance1) {
      startPosition = fromX
      endPosition = -distance1
      duration = ((distance1 - Math.abs(fromX)) * 45) / distance1
    } else {
      startPosition = 0
      endPosition = -distance1
      duration = 45
    }

    const animationConfig = {
      x: [startPosition, endPosition] as [number, number],
      transition: {
        duration: duration,
        ease: 'linear',
        // repeat: 0,
        // repeat: Infinity,
        // repeatType: 'loop' as const,
        onUpdate: (latest: number) => x1.set(latest),
        onComplete: () => {
          if (!isPausedRef1.current) {
            setTimeout(() => startAnimation1(0), 0)
          }
        },
      },
    }

    controls1.stop()
    controls1.set({ x: startPosition })
    console.log('startPosition1=', startPosition)
    console.log('endPosition1=', endPosition)

    animationRef1.current = controls1.start(animationConfig)
  }

  const handleMouseEnter2 = () => {
    const currentX2 = x2.get()
    console.log('currentX2=', currentX2)
    controls2.stop()
    animationRef2.current = null
    isPausedRef2.current = true
  }

  const handleMouseLeave2 = () => {
    console.log('in onMouseLeave x2=', x2.get())
    if (isPausedRef2.current) {
      isPausedRef2.current = false
      startAnimation2(x2.get())
    }
  }

  const startAnimation2 = (fromX: number) => {
    if (isPausedRef2.current) return

    let startPosition: number
    let endPosition: number
    let duration: number
    if (fromX === 0 || fromX > 0) {
      startPosition = -distance2
      endPosition = 0
      duration = 45
    } else if (Math.abs(fromX) < distance2) {
      startPosition = fromX
      endPosition = 0
      duration = (Math.abs(fromX) * 45) / distance2
    } else {
      // Обработка случая, когда ни одно условие не выполнилось
      startPosition = -distance2
      endPosition = 0
      duration = 45
    }

    controls2.stop()
    controls2.set({ x: startPosition })

    animationRef2.current = controls2.start({
      x: [startPosition, endPosition],
      transition: {
        duration: duration,
        ease: 'linear',
        // repeat: Infinity,
        // repeatType: 'loop',
        // onRepeat: () => {
        //   console.log('Повторение!'); // Сработает при каждом цикле
        // }
        onUpdate: (latest: number) => x2.set(latest),
        onComplete: () => {
          if (!isPausedRef2.current) {
            setTimeout(() => startAnimation2(0), 0)
          }
        },
      },
    })
  }

  useEffect(() => {
    startAnimation1(0)
    startAnimation2(0)

    return () => {
      // Полная очистка всех анимаций
      controls1.stop()
      animationRef1.current = null
      x1.stop()
      controls2.stop()
      x2.stop()
    }
  }, [whithHeightBlock])

  const handleResize = useCallback(() => {
    if (width! > 1440) {
      setWhithHeightBlock(170)
      setWhithHeightImg(100)
      setWhithHeightText(60)
    } else if (width! > 600 && width! <= 1440) {
      setWhithHeightBlock(120)
      setWhithHeightImg(70)
      setWhithHeightText(40)
    } else {
      setWhithHeightBlock(100)
      setWhithHeightImg(50)
      setWhithHeightText(30)
    }
  }, [width])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.body)

    return () => resizeObserver.disconnect()
  }, [handleResize])

  return (
    <section className={styles.services}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.titleWrapper_title}>
          {t('horizontalPlayer.title')}
        </h3>
      </div>
      <div className={styles.imageStripes}>
        {/* -----------Первая полоса----------- */}
        <motion.div
          key={'first'}
          className={styles.stripes}
          style={{ height: `${whithHeightBlock}px` }}
          onMouseEnter={handleMouseEnter1}
          onMouseLeave={handleMouseLeave1}
        >
          <motion.div
            key={`animation-first-${Math.round(45)}`}
            className={styles.wrapper}
            animate={controls1}
            // style={{ x: x1 }}
          >
            {/* Оригинальные изображения + их клоны */}
            {[...images1, ...images1].map((image, index) => (
              <motion.div
                key={`first`.concat(index.toString())}
                className={styles.horizontalSlaider_Card}
              >
                <div
                  className={styles.horizontalSlaider_Icon}
                  style={{
                    width: `${whithHeightBlock}px`,
                    height: `${whithHeightImg}px`,
                  }}
                >
                  {/* <img
                    className={styles.imgPng}
                    style={{
                      width: `${whithHeightImg - 10}px`,
                      height: `${whithHeightImg - 10}px`,
                    }}
                    src={image.icon}
                    alt={`image-${index}`}
                  /> */}
                  <LazyImage
                    src={image.icon}
                    alt={`image-${index}`}
                    className={styles.imgPng}
                    style={{
                      width: `${whithHeightImg - 10}px`,
                      height: `${whithHeightImg - 10}px`,
                    }}
                  />
                </div>
                <div
                  className={styles.horizontalSlaider_Text}
                  style={{
                    width: `${whithHeightBlock}px`,
                    height: `${whithHeightText}px`,
                  }}
                >
                  {image.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* -----------Вторая полоса----------- */}
        <motion.div
          key={'second'}
          className={styles.stripes}
          style={{ height: `${whithHeightBlock}px` }}
          onMouseEnter={handleMouseEnter2}
          onMouseLeave={handleMouseLeave2}
        >
          <motion.div
            key={`animation-second-${Math.round(45)}`}
            className={styles.wrapper}
            animate={controls2}
            // style={{ x: x2 }}
          >
            {/* Оригинальные изображения + их клоны */}
            {[...images2, ...images2].map((image, index) => (
              <motion.div
                key={`second`.concat(index.toString())}
                className={styles.horizontalSlaider_Card}
              >
                <div
                  className={styles.horizontalSlaider_Icon}
                  style={{
                    width: `${whithHeightBlock}px`,
                    height: `${whithHeightImg}px`,
                  }}
                >
                  {/* <img
                    className={styles.imgPng}
                    style={{
                      width: `${whithHeightImg - 10}px`,
                      height: `${whithHeightImg - 10}px`,
                    }}
                    src={image.icon}
                    alt={`image-${index}`}
                  /> */}
                  <LazyImage
                    src={image.icon}
                    alt={`image-${index}`}
                    className={styles.imgPng}
                    style={{
                      width: `${whithHeightImg - 10}px`,
                      height: `${whithHeightImg - 10}px`,
                    }}
                  />
                </div>
                <div
                  className={styles.horizontalSlaider_Text}
                  style={{
                    width: `${whithHeightBlock}px`,
                    height: `${whithHeightText}px`,
                  }}
                >
                  {image.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className={styles.titleWrapper}>
        <p className={styles.titleWrapper_paragraph}>
          {t('horizontalPlayer.paragraph')}
        </p>
      </div>
    </section>
  )
}
