import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './FrontReverseCard.module.css'

export const FrontReverseCard: React.FC = () => {
  const { t } = useTranslation()

  const cards = [
    {
      name: t('frontReverseCard.name1'),
      description: t('frontReverseCard.description1'),
    },
    {
      name: t('frontReverseCard.name2'),
      description: t('frontReverseCard.description2'),
    },
    {
      name: t('frontReverseCard.name3'),
      description: t('frontReverseCard.description3'),
    },
  ]
  const cardWidth = `${80 / cards.length}%`
  // console.log('cardWidth=', cardWidth)

  const [flipped, setFlipped] = useState<number | null>(null)

  return (
    <div
      className={styles.wrapperCards}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '25px',
        textAlign: 'center',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${styles.productCard} ${
            flipped === index ? styles.flipped : ''
          }`}
          style={{
            width: cardWidth,
            transform: flipped === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
            // transition: 'transform 0.5s ease',
          }}
          onClick={() => setFlipped(flipped === index ? null : index)}
        >
          <p
            className={styles.front}
            style={{
              width: '100%',
              margin: '0 auto',
              fontSize: '25px',
              textTransform: 'uppercase',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              // opacity: `${flipped === index ? 0 : 1}`,
            }}
          >
            {card.name}
          </p>
          <p
            className={styles.back}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}
