import React from 'react'
import { basicUrl } from '../../../utilita/default.ts'
import styles from './ImageSection.module.css'

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

interface ImageSectionProps {
  sectionImages: { [key: string]: ImageState }
  onRemoveImage: (index: number, isRussian?: boolean) => void
  index: number
  isRussian?: boolean
  t: (key: string) => string
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  sectionImages,
  onRemoveImage,
  index,
  isRussian,
  t,
}) => {
  const key = isRussian ? `${index}_ru` : `${index}_en`
  const imageState = sectionImages[key]

  // Если нет изображения
  if (!imageState || imageState.type === 'none') {
    return null
  }

  const isExisting = imageState.type === 'existing'

  return (
    <div
      className={
        isExisting ? styles.existingImagePreview : styles.newImagePreview
      }
    >
      <p
        className={
          isExisting ? styles.existingImageLabel : styles.newImageLabel
        }
      >
        {isExisting
          ? t('addEditPostForm.currentImage')
          : t('addEditPostForm.newImage')}
        :
      </p>
      <div className={styles.imageContainer}>
        <img
          src={imageState.url}
          alt={imageState.alt || ''}
          className={styles.imagePreview}
          loading="lazy"
          onError={(e) => {
            // Если изображение не загрузилось, показываем заглушку
            e.currentTarget.src = `${basicUrl.urlFilePlug}?nameImagePlug=image-black.svg`
          }}
        />
        <div className={styles.imageInfo}>
          <span className={styles.imageName}>{imageState.fileName}</span>

          <button
            type="button"
            onClick={() => {
              onRemoveImage(index, isRussian)
            }}
            className={styles.removeImageButton}
          >
            {t('addEditPostForm.removeImage')}
          </button>
        </div>
      </div>
    </div>
  )
}
