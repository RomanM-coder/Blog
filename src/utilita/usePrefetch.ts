// Хук для предзагрузки
import { useCallback } from 'react'

export const usePrefetch = (importFn: () => Promise<any>) => {
  const prefetch = useCallback(() => {
    // importFn() // просто загружаем код
    console.log('⚡ executing prefetch')
    importFn().catch((err) => console.error('❌ import failed:', err))
  }, [importFn])

  return prefetch
}
