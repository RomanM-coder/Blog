// useScrollDirection.ts
import { useEffect, useRef } from 'react'

// export const useScrollDirection = () => {
//   const [isMenuVisible, setIsMenuVisible] = useState(true)
//   // const [lastScrollY, setLastScrollY] = useState(0)
//   // const lastScrollYRef = useRef(0)
//   const lastScrollYRef = useRef(window.scrollY)
//   // const lastTimestampRef = useRef(0) // отдельный ref для времени
//   // const isMenuVisibleRef = useRef(true)
//   const tickingRef = useRef(false)

//   // console.log('🔵 useScrollDirection rendered')
//   useEffect(() => {
//     const handleScroll = () => {
//       // const currentScrollY = window.scrollY
//       if (tickingRef.current) return
//       tickingRef.current = true

//       // console.log('🔄 useScrollDirection - scroll event:', currentScrollY)
//       // if (Date.now() - lastTimestampRef.current < 10) {
//       //   console.log('⏱️ Throttled')
//       //   return
//       // }
//       // lastTimestampRef.current = Date.now()

//       // console.log('📊 Direction check:', {
//       //   current: currentScrollY,
//       //   last: lastScrollYRef.current,
//       //   isMenuVisible,
//       //   direction: currentScrollY > lastScrollYRef.current ? 'down' : 'up',
//       // })

//       // Если движемся вниз и меню видимо — скрываем его
//       // if (
//       //   currentScrollY > lastScrollYRef.current &&
//       //   // currentScrollY > lastScrollY &&
//       //   currentScrollY > 60 &&
//       //   // isMenuVisible
//       //   isMenuVisibleRef.current
//       // ) {
//       //   setIsMenuVisible(false)
//       //   isMenuVisibleRef.current = false
//       // }

//       // // Если движемся вверх и меню не видимо — показываем его
//       // if (
//       //   currentScrollY < lastScrollYRef.current &&
//       //   // currentScrollY < lastScrollY &&
//       //   // !isMenuVisible
//       //   !isMenuVisibleRef.current
//       // ) {
//       //   setIsMenuVisible(true)
//       //   isMenuVisibleRef.current = true
//       // }
//       // setLastScrollY(currentScrollY)

//       requestAnimationFrame(() => {
//         const currentScrollY = window.scrollY
//         const delta = currentScrollY - lastScrollYRef.current

//         // Логика показа/скрытия
//         if (delta > 5 && currentScrollY > 60 && isMenuVisible) {
//           setIsMenuVisible(false)
//         } else if (delta < -5 && !isMenuVisible) {
//           setIsMenuVisible(true)
//         }

//         lastScrollYRef.current = currentScrollY
//         tickingRef.current = false
//       })
//     }

//     window.addEventListener('scroll', handleScroll, { passive: true })
//     console.log('✅ useScrollDirection event listener added')
//     return () => {
//       console.log('❌ useScrollDirection event listener removed')
//       window.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

export const useScrollDirection = () => {
  const lastScrollYRef = useRef(window.scrollY)
  const tickingRef = useRef(false)
  // Только ref — без состояния
  const isMenuVisibleRef = useRef(true)

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const delta = currentScrollY - lastScrollYRef.current

        // Обновляем только ref
        if (delta > 5 && currentScrollY > 60) {
          isMenuVisibleRef.current = false
        } else if (delta < -5) {
          isMenuVisibleRef.current = true
        }

        lastScrollYRef.current = currentScrollY
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { isMenuVisibleRef, lastScrollYRef }
}
