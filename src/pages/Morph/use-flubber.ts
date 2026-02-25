import { interpolate } from 'flubber'
import { MotionValue, useTransform } from 'framer-motion'
import { useMemo } from 'react'

// Глобальный кэш для тяжелых вычислений
const interpolationCache = new Map()

const getInterpolatorKey = (a: string, b: string) =>
  `${a.length}-${b.length}|${a.slice(0, 20)}-${b.slice(0, 20)}`

export const useOptimizedFlubber = (
  progress: MotionValue<number>,
  paths: string[]
) => {
  // Создаем стабильный ключ для всего набора путей
  const pathsKey = useMemo(
    () => paths.map((p) => p.length + p.slice(0, 10)).join('|'),
    [paths]
  )

  const { outputRange, mixer } = useMemo(() => {
    // Проверяем глобальный кэш
    if (interpolationCache.has(pathsKey)) {
      return interpolationCache.get(pathsKey)
    }

    const outputRange = paths.map((_, index) => index)

    // Создаем оптимизированную mixer функцию с кэшированием
    const mixer = (a: string, b: string) => {
      const key = getInterpolatorKey(a, b)

      if (!interpolationCache.has(key)) {
        interpolationCache.set(
          key,
          interpolate(a, b, {
            maxSegmentLength: 0.1,
            single: true,
          })
        )

        // Ограничиваем размер кэша
        if (interpolationCache.size > 20) {
          const firstKey = interpolationCache.keys().next().value
          interpolationCache.delete(firstKey)
        }
      }

      return interpolationCache.get(key)!
    }

    const result = { outputRange, mixer }
    interpolationCache.set(pathsKey, result)

    return result
  }, [pathsKey])

  return useTransform(progress, outputRange, paths, { mixer })
}
