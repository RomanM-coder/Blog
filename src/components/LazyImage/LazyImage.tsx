import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  style?: {
    width?: string
    height?: string
  }
}

export const LazyImage = ({ src, alt, className, style }: LazyImageProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const placeholderRef = useRef<HTMLDivElement>(null) // Наблюдаем за плейсхолдером
  const { t } = useTranslation()

  // вариант 1
  useEffect(() => {
    if (!placeholderRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        console.log(`Intersection для ${alt}:`, {
          isIntersecting: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          boundingRect: entry.boundingClientRect.top,
        })

        if (entry.isIntersecting) {
          console.log(`НАЧИНАЮ загрузку: ${alt}`)
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: '50px 0px 0px 0px', // Начать загрузку за 50px до появления в зоне видимости
        threshold: 0.01, // Сработать, даже если видно 1% элемента
      },
    )

    observer.observe(placeholderRef.current)

    return () => {
      observer.disconnect()
    }
  }, []) // Зависимостей нет, эффект выполняется один раз при монтировании

  // Рендерим два разных DOM-дерева
  if (!isVisible) {
    // Стадия 1: Показываем только плейсхолдер. Изображения в DOM еще нет.
    return (
      <div
        ref={placeholderRef} // Observer следит за этим div
        className={className}
        style={{
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: style?.width || '100%',
          height: style?.height || '100%',
          minHeight: '150px',
        }}
      >
        {t('lazyImages.loading')}
      </div>
    )
  }

  // Стадия 2: Когда isVisible = true, рендерим полноценное изображение
  return (
    <img
      src={src} // Атрибут src заполняется только сейчас
      alt={alt}
      className={className}
      style={{
        // width: '100%',
        // height: '100%',
        objectFit: 'cover', // contain
        objectPosition: 'center',
        width: style?.width ? style?.width : '100%',
        height: style?.height ? style?.height : '100%',
        /* Гарантируем размеры для SVG */
        ...(src.endsWith('.svg') && {
          minWidth: '100%',
          minHeight: '100%',
        }),
      }}
      loading="lazy"
      onError={(e) => {
        console.error('Ошибка загрузки SVG. Событие:', e)
        // Можно временно показать текст вместо картинки при ошибке
        e.currentTarget.style.display = 'none'
        e.currentTarget.insertAdjacentHTML(
          'afterend',
          `<div>${t('lazyImages.notLoading')} ${alt}</div>`,
        )
      }}
    />
  )
}
