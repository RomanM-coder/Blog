import { useState, useEffect, useRef } from 'react'

interface Size {
  width: number | undefined
  height: number | undefined
  ratio: number
}

export default function useScreenSize(): Size {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
    ratio: 1,
  })

  const lastExecutedRef = useRef<number>(0)

  useEffect(() => {
    function handleResize() {
      const now = Date.now()

      // выполняем не чаще чем раз 50 мс
      if (now - lastExecutedRef.current >= 50) {
        updateSize()
        lastExecutedRef.current = now
      }
    }

    function updateSize() {
      const newRatio = window.devicePixelRatio
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: newRatio,
      })
    }

    window.addEventListener('resize', handleResize)
    updateSize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
