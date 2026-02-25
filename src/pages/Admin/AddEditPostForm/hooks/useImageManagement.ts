// hooks/useImageManagement.ts
import React from 'react'
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form'

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

export const useImageManagement = (
  getValues: UseFormGetValues<any>,
  setValue: UseFormSetValue<any>,
  sectionImages: { [key: string]: ImageState },
  setSectionImages: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ImageState
    }>
  >
) => {
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    isRussian: boolean
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const key = `${sectionIndex}_${isRussian ? 'ru' : 'en'}`
    const previewUrl = URL.createObjectURL(file)
    const fieldName = isRussian ? 'sections_ru' : 'sections'

    setSectionImages((prev) => ({
      ...prev,
      [key]: {
        type: 'new',
        url: previewUrl,
        previewUrl,
        fileName: file.name,
        file,
        alt: prev[key]?.alt || '',
      },
    }))

    const updatedSections = [...getValues(fieldName)]
    if (updatedSections[sectionIndex]?.type === 'image') {
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        path: file.name,
        alt: updatedSections[sectionIndex].alt || '',
      }
      setValue(fieldName, updatedSections)
    }
  }
  // Функция для удаления изображения
  const handleRemoveImage = (index: number, isRussian: boolean) => {
    const key = `${index}_${isRussian ? 'ru' : 'en'}`
    const currentImage = sectionImages[key]

    if (currentImage?.previewUrl) {
      URL.revokeObjectURL(currentImage.previewUrl)
    }

    setSectionImages((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })

    const fieldName = isRussian ? 'sections_ru' : 'sections'
    const updatedSections = [...getValues(fieldName)]

    if (updatedSections[index]?.type === 'image') {
      updatedSections[index] = {
        ...updatedSections[index],
        path: '',
      }
      setValue(fieldName, updatedSections)
    }
  }

  return { handleImageUpload, handleRemoveImage }
}
