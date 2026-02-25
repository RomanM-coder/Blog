// hooks/useFormChanges.ts
import { useEffect, useState, useRef, useCallback } from 'react'
import { UseFormWatch, UseFormGetValues } from 'react-hook-form'

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}
// Утилита для глубокого копирования
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof RegExp) return new RegExp(obj) as any

  const clone: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key])
    }
  }

  return clone
}

// Утилита для сравнения (с игнором временных полей)
const compareValues = (current: any, initial: any): boolean => {
  // Игнорируем поля, которые не должны влиять на изменения
  const ignoreFields = ['id', '_id', '__v', 'createdAt', 'updatedAt']

  const cleanCurrent = { ...current }
  const cleanInitial = { ...initial }

  // Удаляем игнорируемые поля
  ignoreFields.forEach((field) => {
    delete cleanCurrent[field]
    delete cleanInitial[field]
  })

  // Для массивов секций нужно сравнивать содержимое, а не ссылки
  if (cleanCurrent.sections && cleanInitial.sections) {
    if (
      JSON.stringify(cleanCurrent.sections) !==
      JSON.stringify(cleanInitial.sections)
    ) {
      return true
    }
  }

  if (cleanCurrent.sections_ru && cleanInitial.sections_ru) {
    if (
      JSON.stringify(cleanCurrent.sections_ru) !==
      JSON.stringify(cleanInitial.sections_ru)
    ) {
      return true
    }
  }

  // Удаляем секции из сравнения, т.к. их уже сравнили
  delete cleanCurrent.sections
  delete cleanCurrent.sections_ru
  delete cleanInitial.sections
  delete cleanInitial.sections_ru

  // Сравниваем остальные поля
  return JSON.stringify(cleanCurrent) !== JSON.stringify(cleanInitial)
}

export const useFormChanges = (
  modePost: 'add' | 'edit',
  defaultValues: any,
  watch: UseFormWatch<any>,
  getValues: UseFormGetValues<any>,
  sectionImages: { [key: string]: ImageState }
) => {
  const [hasChanges, setHasChanges] = useState(false)
  const initialValuesRef = useRef<any>(null)

  // Инициализируем начальные значения
  useEffect(() => {
    if (modePost === 'edit' && defaultValues && !initialValuesRef.current) {
      // Сохраняем глубокую копию начальных значений
      initialValuesRef.current = deepClone(defaultValues)
    }
  }, [modePost, defaultValues])

  // Функция проверки изменений
  const checkForChanges = useCallback(() => {
    if (modePost === 'add') return true

    if (!initialValuesRef.current) return false

    const currentValues = getValues()

    // Проверяем изменения в форме
    const formChanged = compareValues(currentValues, initialValuesRef.current)

    // Проверяем изменения в изображениях
    const imagesChanged = Object.values(sectionImages).some(
      (image) => image.type === 'new' || image.type === 'none'
    )

    return formChanged || imagesChanged
  }, [modePost, getValues, sectionImages])

  // Следим за изменениями
  useEffect(() => {
    // Для отслеживания изменений формы
    const subscription = watch(() => {
      setHasChanges(checkForChanges())
    })

    return () => subscription.unsubscribe()
  }, [watch, checkForChanges])

  // Также следим за изменениями изображений
  useEffect(() => {
    setHasChanges(checkForChanges())
  }, [sectionImages, checkForChanges])

  return hasChanges
}
