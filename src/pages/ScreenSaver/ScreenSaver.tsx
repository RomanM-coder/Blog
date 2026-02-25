import React, { useEffect, useState } from 'react'
import { HeaderLanding } from '../../components/HeaderLanding/HeaderLanding'
import { FrontReverseCard } from '../FrontReverseCard/FrontReverseCard'
import { Variant3 } from '../Variant3/Variant3'
import { XCardStack5 } from '../XCargStack5/XCardStack5'
import { ImageStripes } from '../FirstScreen/FirstScreen'
import { SecondScreen2 } from '../SecondScreen2/SecondScreen2'
import { HorizontalPlayer2 as HorizontalPlayer } from '../HorizontalPlayer2/HorizontalPlayer2'
import { Preserve3d } from '../Preserve3d/Preserve3d'
// import { ReverseInput } from '../ReverseInput/ReverseInput'
import styles from './ScreenSaver.module.css'

export const ScreenSaver: React.FC = () => {
  const [readyLoad, setReadyLoad] = useState(false)
  // const containerRef = useRef<HTMLDivElement>(null)

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
  const init = () => {
    setReadyLoad(true)
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    let rafId: number | null = null
    // Сохраняем ссылку на функцию обработчика
    const handleLoad = () => {
      timeoutId = setTimeout(checkLayoutStability, 500)
    }

    const checkLayoutStability = () => {
      // Используем requestAnimationFrame для проверки в следующем кадре рендеринга
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          // Два кадра подряд без изменений - считаем layout стабильным
          init()
        })
      })
    }

    // Запускаем инициализацию после полной загрузки страницы
    if (document.readyState === 'complete') {
      // Даем браузеру время на применение стилей
      timeoutId = setTimeout(checkLayoutStability, 500)
    } else {
      window.addEventListener('load', handleLoad)
    }
    return () => {
      window.removeEventListener('load', handleLoad)
      if (timeoutId) clearTimeout(timeoutId)
      // Добавляем отмену requestAnimationFrame
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className={styles.LandingWrapper}>
      <HeaderLanding />
      <XCardStack5 readyLoad={readyLoad} />
      <Variant3 readyLoad={readyLoad} />
      <ImageStripes />
      <HorizontalPlayer />
      <Preserve3d />
      <FrontReverseCard />
      <SecondScreen2 readyLoad={readyLoad} />
      {/* <ReverseInput /> */}
    </div>
  )
}
