// SectionsPanel.tsx
import React from 'react'
import {
  UseFormRegister,
  UseFieldArrayRemove,
  FieldArrayWithId,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'
import { ImageSection } from '../AddEditPostForm/ImageSection.tsx'
import styles from './SectionsPanel.module.css'

type SectionType = 'text' | 'image'

type TextSection = {
  type: 'text'
  content: string
  order: number
}

type ImageSection = {
  type: 'image'
  order: number
  alt: string
  path?: string
}

type Section = TextSection | ImageSection

// Тип для поля из useFieldArray
type SectionField = FieldArrayWithId<
  {
    sections: Section[]
  },
  'sections',
  'id'
>
type SectionRuField = FieldArrayWithId<
  {
    sections_ru: Section[]
  },
  'sections_ru',
  'id'
>

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

interface SectionsPanelProps {
  addSection: (type: SectionType, isRussian?: boolean) => void
  sectionsFields: SectionField[] | SectionRuField[]
  sectionImages: {
    [key: string]: ImageState
  }
  isRussian: boolean
  moveSectionUp: (index: number, isRussian?: boolean) => void
  moveSectionDown: (index: number, isRussian?: boolean) => void
  removeSection: UseFieldArrayRemove
  register: UseFormRegister<any>
  setSectionImages: (
    value: React.SetStateAction<{
      [key: string]: ImageState
    }>
  ) => void
  getValues: UseFormGetValues<any>
  setValue: UseFormSetValue<any>
  t: (key: string) => string
  sectionErrors: any
}

export const SectionsPanel: React.FC<SectionsPanelProps> = ({
  addSection,
  sectionsFields,
  sectionImages,
  isRussian,
  moveSectionDown,
  moveSectionUp,
  removeSection,
  register,
  setSectionImages,
  setValue,
  getValues,
  t,
  sectionErrors,
}) => {
  // Вспомогательная функция для получения ошибки
  const getSectionError = (
    index: number,
    field: string
  ): string | undefined => {
    if (!sectionErrors || !sectionErrors[index]) return undefined
    const error = sectionErrors[index][field]
    return error?.message
  }

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    isRussian: boolean = false
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const key = isRussian ? `${sectionIndex}_ru` : `${sectionIndex}_en`
      const previewUrl = URL.createObjectURL(file)

      setSectionImages((prev) => ({
        ...prev,
        [key]: {
          type: 'new',
          url: previewUrl, // Для предпросмотра
          previewUrl: previewUrl, // Сохраняем отдельно для очистки
          fileName: file.name,
          file: file,
          alt: prev[key]?.alt || '', // Сохраняем старый alt если был
        },
      }))

      const fieldName = isRussian ? 'sections_ru' : 'sections'
      const currentSections = getValues(fieldName)
      const updatedSections = [...currentSections]

      if (updatedSections[sectionIndex].type === 'image') {
        // Сохраняем старый alt если он есть
        const currentAlt = updatedSections[sectionIndex].alt || ''
        // const imageSection = updatedSections[sectionIndex] as ImageSection
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          path: file.name,
          alt: currentAlt,
        }
        setValue(fieldName, updatedSections)
      }
    }
  }

  // 6. Функция для удаления существующего изображения
  const handleRemoveImage = (index: number, isRussian: boolean = false) => {
    const key = isRussian ? `${index}_ru` : `${index}_en`

    // Очищаем URL если это новое изображение
    const currentImage = sectionImages[key]
    if (currentImage?.type === 'new' && currentImage.previewUrl) {
      URL.revokeObjectURL(currentImage.previewUrl)
    }

    // Удаляем изображение из состояния
    setSectionImages((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })

    // Очищаем поле в форме
    const fieldName = isRussian ? 'sections_ru' : 'sections'
    const currentSections = getValues(fieldName)
    const updatedSections = [...currentSections]

    if (updatedSections[index].type === 'image') {
      updatedSections[index] = {
        ...updatedSections[index],
        path: '',
        // alt оставляем как есть
      }
      setValue(fieldName, updatedSections)
    }
  }

  return (
    <div className={styles.sectionsContainer}>
      <div className={styles.sectionHeader}>
        <h3>
          {isRussian
            ? t('addEditPostForm.sectionsRu')
            : t('addEditPostForm.sectionsEn')}
        </h3>
        <div className={styles.sectionButtons}>
          <button
            type="button"
            onClick={() => addSection('text', isRussian)}
            className={styles.addSectionButton}
          >
            {t('addEditPostForm.addTextSection')}
          </button>
          <button
            type="button"
            onClick={() => addSection('image', isRussian)}
            className={styles.addSectionButton}
          >
            {t('addEditPostForm.addImageSection')}
          </button>
        </div>
      </div>

      {sectionsFields.map((field, index) => {
        const contentError = getSectionError(index, 'content')
        const altError = getSectionError(index, 'alt')

        return (
          <div key={field.id} className={styles.sectionItem}>
            <div className={styles.sectionHeaderControls}>
              <div className={styles.sectionType}>
                <strong>
                  {field.type === 'text'
                    ? t('addEditPostForm.textSection')
                    : t('addEditPostForm.imageSection')}
                </strong>
                <span className={styles.orderBadge}>
                  {t('addEditPostForm.order')}: {field.order || index}
                </span>
              </div>
              <div className={styles.sectionControls}>
                <button
                  type="button"
                  onClick={() => moveSectionUp(index, false)}
                  className={styles.moveButton}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSectionDown(index, false)}
                  className={styles.moveButton}
                  disabled={index === sectionsFields.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className={styles.removeSectionButton}
                >
                  {t('addEditPostForm.removeSection')}
                </button>
              </div>
            </div>

            {field.type === 'text' ? (
              <div className={styles.textSection}>
                <input
                  type="hidden"
                  {...register(
                    `${isRussian ? 'sections_ru' : 'sections'}.${index}.order`
                  )}
                  value={index}
                />
                <textarea
                  {...register(
                    `${isRussian ? 'sections_ru' : 'sections'}.${index}.content`
                  )}
                  placeholder={t('addEditPostForm.placeholderSectionContent')}
                  className={`${styles.textareaSection} ${
                    contentError ? styles.isInvalid : ''
                  }`}
                  rows={6}
                />
                {contentError && (
                  <p role="alert" className={styles.textareaError}>
                    {contentError}
                  </p>
                )}
              </div>
            ) : (
              <div className={styles.imageSection}>
                <input
                  type="hidden"
                  {...register(
                    `${isRussian ? 'sections_ru' : 'sections'}.${index}.order`
                  )}
                  value={index}
                />
                <div className={styles.imageInputs}>
                  <div className={styles.imageWrapper}>
                    <label className={styles.customFileUpload}>
                      <label>{t('addEditPostForm.imageFile')}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index, isRussian)}
                        className={styles.fileInput}
                      />
                      <span className={styles.fileLabel}>
                        {t('addEditPostForm.chooseFile')}
                      </span>
                    </label>
                  </div>

                  {/* Отображение существующего изображения */}
                  {isRussian
                    ? sectionImages[`${index}_ru`]?.type === 'existing' && (
                        <ImageSection
                          sectionImages={sectionImages}
                          onRemoveImage={handleRemoveImage}
                          index={index}
                          isRussian={true}
                          t={t}
                        />
                      )
                    : sectionImages[`${index}_en`]?.type === 'existing' && (
                        <ImageSection
                          sectionImages={sectionImages}
                          onRemoveImage={handleRemoveImage}
                          index={index}
                          isRussian={false}
                          t={t}
                        />
                      )}

                  {/* Отображение предпросмотра нового файла, если выбран */}
                  {isRussian
                    ? sectionImages[`${index}_ru`]?.type === 'new' && (
                        <ImageSection
                          sectionImages={sectionImages}
                          onRemoveImage={handleRemoveImage}
                          index={index}
                          isRussian={true}
                          t={t}
                        />
                      )
                    : sectionImages[`${index}_en`]?.type === 'new' && (
                        <ImageSection
                          sectionImages={sectionImages}
                          onRemoveImage={handleRemoveImage}
                          index={index}
                          isRussian={false}
                          t={t}
                        />
                      )}
                  <div className={styles.altContainer}>
                    <div className={styles.altWrapper}>
                      <label>{t('addEditPostForm.altText')}</label>
                      <input
                        type="text"
                        {...register(
                          `${
                            isRussian ? 'sections_ru' : 'sections'
                          }.${index}.alt`
                        )}
                        placeholder={t('addEditPostForm.placeholderAltText')}
                        className={
                          styles.inputEditPost + ' ' + styles.inputAltEditPost
                        }
                      />
                    </div>
                    {altError && (
                      <p role="alert" className={styles.altError}>
                        {altError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
