import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { LazyImage } from '../../components/LazyImage/LazyImage.tsx'
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
import image11 from '../../assets/static/law.svg'
import image12 from '../../assets/static/bag-basket-cart.svg'
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
import image23 from '../../assets/static/scales-thin.svg'
import image24 from '../../assets/static/photo.svg'
import image25 from '../../assets/static/rounded-square-arrow-indicator-right.svg'
import styles from './FirstScreen.module.css'

export const ImageStripes: React.FC = () => {
  const [numberStripe, setNumberStripe] = useState(4)
  const { t } = useTranslation()
  const { width } = useScreenSize() // перерасчет ширин элементов

  const images1 = [
    {
      icon: image1,
      text: t('imageStripes.images1.image1'),
    },
    {
      icon: image2,
      text: t('imageStripes.images1.image2'),
    },
    {
      icon: image3,
      text: t('imageStripes.images1.image3'),
    },
    {
      icon: image4,
      text: t('imageStripes.images1.image4'),
    },
    {
      icon: image5,
      text: t('imageStripes.images1.image5'),
    },
    {
      icon: image6,
      text: t('imageStripes.images1.image6'),
    },
  ]
  const images2 = [
    {
      icon: image7,
      text: t('imageStripes.images2.image7'),
    },
    {
      icon: image8,
      text: t('imageStripes.images2.image8'),
    },
    {
      icon: image9,
      text: t('imageStripes.images2.image9'),
    },
    {
      icon: image10,
      text: t('imageStripes.images2.image10'),
    },
    {
      icon: image11,
      text: t('imageStripes.images2.image11'),
    },
    {
      icon: image12,
      text: t('imageStripes.images2.image12'),
    },
  ]
  const images3 = [
    {
      icon: image13,
      text: t('imageStripes.images3.image13'),
    },
    {
      icon: image14,
      text: t('imageStripes.images3.image14'),
    },
    {
      icon: image15,
      text: t('imageStripes.images3.image15'),
    },
    {
      icon: image16,
      text: t('imageStripes.images3.image16'),
    },
    {
      icon: image17,
      text: t('imageStripes.images3.image17'),
    },
    {
      icon: image18,
      text: t('imageStripes.images3.image18'),
    },
  ]
  const images4 = [
    {
      icon: image19,
      text: t('imageStripes.images4.image19'),
    },
    {
      icon: image20,
      text: t('imageStripes.images4.image20'),
    },
    {
      icon: image21,
      text: t('imageStripes.images4.image21'),
    },
    {
      icon: image22,
      text: t('imageStripes.images4.image22'),
    },
    {
      icon: image23,
      text: t('imageStripes.images4.image23'),
    },
    {
      icon: image24,
      text: t('imageStripes.images4.image24'),
    },
  ]
  const imgsBig = [images1, images2, images3, images4]
  const imgsSmall = [images1, images2, images3]
  const imgs = numberStripe === 4 ? imgsBig : imgsSmall
  const countStrip = [-1, 1, -1, 1]
  const containerHeight = 700
  const imageHeight = 50
  const margin = 3
  // let image25

  // useEffect(() => {
  //   const loadImage = async () => {
  //     image25 =
  //       await import('/src/assets/static/media/rounded-square-arrow-indicator-right.svg')
  //   }
  //   loadImage()
  // }, [])

  useEffect(() => {
    if (width! >= 1280) setNumberStripe(4)
    else setNumberStripe(3)
  }, [width])

  return (
    <section className={styles.services}>
      <div className={styles.imageStripes}>
        {imgs.map((item, i) => {
          const distance = item.length * imageHeight * margin
          const duration = distance / 50

          return (
            <motion.div
              key={i}
              className={styles.stripes}
              style={{ height: `${containerHeight}px` }}
            >
              {/* Анимация движения */}
              <motion.div
                key={`animation-${i}-${Math.round(duration)}`}
                className={styles.wrapper}
                initial={{
                  y: countStrip[i] > 0 ? `0px` : `-${distance}px`,
                }}
                animate={{
                  y: countStrip[i] > 0 ? `-${distance}px` : `0px`,
                }}
                transition={{
                  duration: 45,
                  //duration: (item.length * imageHeight) / 20, // Скорость анимации
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
              >
                {/* Оригинальные изображения + их клоны */}
                {[...item, ...item].map((image, index) => (
                  // <div
                  //   className={styles.imgPng}
                  //   key={`${i}`.concat(index.toString())}
                  //   style={{backgroundImage: `url(${image})`}}
                  // >{image}</div>
                  <motion.div
                    key={`${i}`.concat(index.toString())}
                    className={styles.verticalSlaider_Card}
                    style={{
                      // height: `${imageHeight}px`,
                      top: `${index * imageHeight * margin}px`,
                    }}
                  >
                    <div className={styles.verticalSlaider_Icon}>
                      {/* <img
                        className={styles.imgPng}
                        style={{ height: `${imageHeight}px` }}
                        src={image.icon}
                        alt={`image-${index}`}
                      /> */}
                      <LazyImage
                        src={image.icon}
                        alt={`image-${index}`}
                        className={styles.imgPng}
                        style={{ height: `${imageHeight}px`, width: '60px' }}
                      />
                    </div>
                    <div className={styles.verticalSlaider_Text}>
                      {image.text}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
      <div className={styles.titleWrapper}>
        <h3 className={styles.titleWrapper_title}>{t('imageStripes.title')}</h3>
        <p className={styles.titleWrapper_paragraph1}>
          {t('imageStripes.paragraph1')}
        </p>
        <p className={styles.titleWrapper_paragraph2}>
          {t('imageStripes.paragraph2')}
        </p>
        <button className={styles.buttonGo}>
          {t('imageStripes.go')}
          <div style={{ display: 'flex' }}>
            <img
              className={styles.buttonImg}
              src={image25}
              alt={'buttonImg'}
              loading="lazy"
            />
          </div>
        </button>
        {width! <= 800 ? (
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#b4b0b0',
              margin: '20px 0 0 0',
            }}
          ></div>
        ) : null}
      </div>
    </section>
  )
}
// анимация числа
// import "./styles.css";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
// import { useEffect } from "react";

// export default function App() {
//   const count = useMotionValue(0);
//   const rounded = useTransform(count, Math.round);

//   useEffect(() => {
//     const animation = animate(count, 50, {
//       duration: 2
//     });
//   }, []);

//   return <motion.h1>{rounded}</motion.h1>;
// }
