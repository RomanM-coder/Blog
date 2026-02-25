// hooks/useSectionsManagement.ts
import React from 'react'
import {
  UseFormGetValues,
  UseFormSetValue,
  useFieldArray,
  Control,
} from 'react-hook-form'

type FormSchema = {
  title: string
  title_ru: string
  sections: (
    | {
        type: 'text'
        content: string
        order: number
      }
    | {
        type: 'image'
        order: number
        alt: string
        path?: string | undefined
      }
  )[]
  sections_ru: (
    | {
        type: 'text'
        content: string
        order: number
      }
    | {
        type: 'image'
        order: number
        alt: string
        path?: string | undefined
      }
  )[]
  favorite: number
  nofavorite: number
  views: number
}

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

type SectionType = 'text' | 'image'

export const useSectionsManagement = (
  control: Control<FormSchema>,
  isRussian: boolean,
  getValues: UseFormGetValues<FormSchema>,
  setValue: UseFormSetValue<FormSchema>,
  setSectionImages: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ImageState
    }>
  >,
) => {
  const fieldName = isRussian ? 'sections_ru' : 'sections'

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: fieldName,
  })

  const addSection = (type: SectionType) => {
    const newOrder = fields.length
    const newSection =
      type === 'text'
        ? { type: 'text' as const, content: '', order: newOrder }
        : { type: 'image' as const, path: '', alt: '', order: newOrder }

    append(newSection)
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const suffix = isRussian ? '_ru' : '_en'
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < fields.length - 1)
    ) {
      // Перемещаем в useFieldArray
      move(index, newIndex)

      // Обновляем order
      const updatedSections = [...getValues(fieldName as any)]
      updatedSections.forEach((i) => {
        setValue(`${fieldName}.${i}.order`, i)
      })

      // Обновляем изображения
      setSectionImages((prev) => {
        const updated = { ...prev }
        const oldKey1 = `${index}${suffix}`
        const oldKey2 = `${newIndex}${suffix}`
        const newKey1 = `${newIndex}${suffix}`
        const newKey2 = `${index}${suffix}`

        const temp1 = updated[oldKey1]
        const temp2 = updated[oldKey2]

        if (temp1) {
          updated[newKey1] = temp1
          delete updated[oldKey1]
        }
        if (temp2) {
          updated[newKey2] = temp2
          delete updated[oldKey2]
        }

        return updated
      })
    }
  }

  return {
    fields,
    addSection,
    removeSection: remove,
    moveSectionUp: (index: number) => moveSection(index, 'up'),
    moveSectionDown: (index: number) => moveSection(index, 'down'),
  }
}
