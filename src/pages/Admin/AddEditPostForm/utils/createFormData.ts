// utils/formDataUtils.ts
import { IPostForm } from '../../../../utilita/modelPostForm'

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

type Section =
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

/**
 * Создает FormData из данных формы
 * Чистая функция - только преобразование данных
 */
export const createFormData = (
  postForm: FormSchema,
  sectionImages: { [key: string]: ImageState },
  modePost: 'add' | 'edit',
  extendedSelectedPost: IPostForm,
  categoryId: string,
  userId: string,
): FormData => {
  const formData = new FormData()

  // 1. Базовые поля
  formData.append('id', extendedSelectedPost._id || '')
  formData.append('title', postForm.title)
  formData.append('title_ru', postForm.title_ru)
  formData.append('categoryId', categoryId)
  if (modePost === 'edit')
    formData.append('nameOld', extendedSelectedPost.title)
  formData.append('adminId', userId)
  formData.append('favorite', postForm.favorite.toString())
  formData.append('nofavorite', postForm.nofavorite.toString())
  formData.append('views', postForm.views.toString())

  if (modePost === 'edit') {
    // 2. Подготовка секций (чистое преобразование данных)
    const sections = prepareSections(postForm.sections, sectionImages, 'en')
    const sectionsRu = prepareSections(
      postForm.sections_ru,
      sectionImages,
      'ru',
    )

    formData.append('sections', JSON.stringify(sections))
    formData.append('sections_ru', JSON.stringify(sectionsRu))

    // Добавляем ТОЛЬКО НОВЫЕ файлы
    Object.entries(sectionImages).forEach(([key, image]) => {
      console.log(`Checking image ${key}:`, {
        type: image.type,
        hasFile: !!image.file,
        fileType: image.file?.constructor?.name,
        isFile: image.file instanceof File,
        fileName: image.file?.name,
        fileSize: image.file?.size,
      })
      if (image.type === 'new' && image.file) {
        const [indexStr, lang] = key.split('_')
        const index = parseInt(indexStr)

        if (lang === 'en') {
          formData.append(`section_image_${index}`, image.file, image.file.name)
          console.log(
            `✓ Добавлен новый EN файл: section_image_${index} = ${image.file.name}`,
          )
        } else if (lang === 'ru') {
          formData.append(
            `section_ru_image_${index}`,
            image.file,
            image.file.name,
          )
          console.log(
            `✓ Добавлен новый RU файл: section_ru_image_${index} = ${image.file.name}`,
          )
        }
      }
    })
  } else if (modePost === 'add') {
    // Добавляем секции как JSON
    formData.append('sections', JSON.stringify(postForm.sections))
    formData.append('sections_ru', JSON.stringify(postForm.sections_ru))

    Object.entries(sectionImages).forEach(([key, image]) => {
      console.log(`Checking image ${key}:`, {
        type: image.type,
        hasFile: !!image.file,
        fileType: image.file?.constructor?.name,
        isFile: image.file instanceof File,
        fileName: image.file?.name,
        fileSize: image.file?.size,
      })

      if (image.file) {
        if (!(image.file instanceof File)) {
          console.error(`File for ${key} is not a File object:`, image.file)
          return
        }

        const [indexStr, lang] = key.split('_')
        const index = parseInt(indexStr)

        if (lang === 'en') {
          formData.append(`section_image_${index}`, image.file, image.file.name)
        } else if (lang === 'ru') {
          formData.append(
            `section_ru_image_${index}`,
            image.file,
            image.file.name,
          )
        }
      }
    })
  }

  return formData
}

// Подготавливает секции с изображениями
const prepareSections = (
  sections: Section[],
  sectionImages: { [key: string]: ImageState },
  lang: string,
) => {
  return sections.map((section, index) => {
    if (section.type !== 'image') return section

    const key = `${index}_${lang}`
    const imageState = sectionImages[key]

    if (!imageState) return section

    // Простое преобразование данных
    if (imageState.type === 'existing' && !imageState.file) {
      return { ...section, path: imageState.fileName }
    }
    if (imageState.type === 'new' && imageState.file) {
      return { ...section, path: imageState.fileName }
    }
    if (imageState.type === 'none') {
      return { ...section, path: '' }
    }

    return section
  })
}
