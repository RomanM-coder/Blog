import React, { useState, useEffect, memo } from 'react'
import { ruble, pound, euro, yen, yuan, rupee, dollar, bitcoin } from './paths'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useOptimizedFlubber } from './use-flubber'
// import {interpolate} from 'flubber'
import styles from './Morph.module.css'

const paths = [ruble, euro, pound, dollar, yen, yuan, bitcoin, rupee, ruble]
const colors = [
  '#00cc88',
  '#0099ff',
  '#8855ff',
  '#00cc88',
  '#ff0055',
  '#ee4444',
  '#ffcc00',
  '#00bb77',
  '#00cc88',
]

export const Morph: React.FC = memo(() => {
  const [pathIndex, setPathIndex] = useState(0)
  const progress = useMotionValue(pathIndex)

  // const progress = useMotionValue(0)
  // const continuousProgress = useTransform(
  //   progress,
  //   (value) => value % paths.length
  // )

  const fill = useTransform(
    progress,
    // continuousProgress,
    paths.map((_, index: number) => index),
    colors,
  )
  const path = useOptimizedFlubber(
    progress,
    // continuousProgress,
    paths,
  )

  useEffect(() => {
    let animation: ReturnType<typeof animate>

    const startAnimation = () => {
      const nextIndex = (pathIndex + 1) % paths.length

      if (nextIndex === 0) {
        progress.set(0)
      }

      // const currentProgress = progress.get()
      // const nextProgress = currentProgress + 1

      animation = animate(progress, nextIndex, {
        duration: 1.0,
        ease: 'easeInOut',
        onComplete: () => {
          setPathIndex(nextIndex)
        },
      })
    }

    // Запускаем анимацию с интервалом
    const interval = setInterval(startAnimation, 2000) // 2 секунды между анимациями

    return () => {
      clearInterval(interval)
      animation?.stop()
    }
  }, [pathIndex, progress])

  return (
    <div className={styles.morphWrapper}>
      <svg width="24" height="24" viewBox="0 0 400 400">
        <g transform="translate(10 10) scale(17 17)">
          <motion.path fill={fill} d={path} />
        </g>
      </svg>
    </div>
  )
})
