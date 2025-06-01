import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeaderLanding } from '../../components/HeaderLanding/HeaderLanding'
import { CardStack } from '../CardStack/CardStack'
import { ImageStripes } from '../FirstScreen/FirstScreen'
import { SecondScreen } from '../SecondScreen/SecondScreen'
import styles from './ScreenSaver.module.css'

export const ScreenSaver: React.FC = () => {

  // const [isMenuVisible, setIsMenuVisible] = useState(true) // Состояние видимости меню
  // const [lastScrollY, setLastScrollY] = useState(0) // Предыдущая позиция скролла

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY

  //     // Если движемся вниз и меню видимо — скрываем его
  //     if (currentScrollY > lastScrollY && isMenuVisible) {
  //       setIsMenuVisible(false)
  //     }

  //     // Если движемся вверх и меню не видимо — показываем его
  //     if (currentScrollY < lastScrollY && !isMenuVisible) {
  //       setIsMenuVisible(true)
  //     }

  //     setLastScrollY(currentScrollY) // Обновляем предыдущую позицию скролла
  //   }

  //   window.addEventListener('scroll', handleScroll)

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [
  //   // lastScrollY, isMenuVisible
  // ])

  return (
  <>  
    <CardStack />
    <ImageStripes />
    <SecondScreen />
  </>  
  )
}
