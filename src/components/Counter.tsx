import { useEffect, useState } from 'react'
import { animate, useScroll } from 'framer-motion'

export const useAnimatedCounter = (
  maxValue: number,
  initialValue = 0,
  duration = 1,
) => {
  const [counter, setCounter] = useState<number>(initialValue)
  const [animated, setAnimated] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
   
    const changeScrollY = scrollY.on("change", (latest) => {
      if (latest >= 2540 && !animated) {
        setAnimated(true)
      
        const controls = animate(initialValue, maxValue, {
          duration,
          onUpdate(value) {
            setCounter(value)
          }
        })
        return () => controls.stop()
      }
    })   

    return () => changeScrollY()
  }, [initialValue, maxValue, duration, animated]) 

  return Math.round(counter)
}