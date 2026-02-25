import { useState, useEffect } from 'react'

export const useDebounce = (
  value: string,
  condition: boolean,
  delay: number
) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, delay])

  return debouncedValue
}
