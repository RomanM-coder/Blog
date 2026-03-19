import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IPostForm } from '../../../utilita/modelPostForm'
import { basicUrl, production } from '../../../utilita/default.ts'
import { useSectionsManagement } from '../AddEditPostForm/hooks/useSectionsManagement.ts'
import { createFormData } from '../AddEditPostForm/utils/createFormData.ts'
import { useFormChanges } from '../AddEditPostForm/hooks/useFormChanges.ts'
import { SectionsPanel } from '../AddEditPostForm/SectionsPanel.tsx'
import close from '../../../assets/static/close_big.svg'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './AddEditPostForm.module.css'

interface AddEditPostFormProps {
  handleAddEditPostFormHide: () => void
  modePost: 'add' | 'edit'
  extendedSelectedPost: IPostForm
  addBlogPost: (post: FormData) => void
  editBlogPost: (post: FormData) => void
  categoryId: string
}

type ImageState = {
  type: 'existing' | 'new' | 'none'
  url: string
  fileName: string
  file?: File
  alt?: string
  previewUrl?: string // Для новых файлов
}

export const AddEditPostForm: React.FC<AddEditPostFormProps> = ({
  handleAddEditPostFormHide,
  modePost,
  extendedSelectedPost,
  addBlogPost,
  editBlogPost,
  categoryId,
}) => {
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const [sectionImages, setSectionImages] = useState<{
    [key: string]: ImageState
  }>({})

  const formSchema = z.object({
    title: z
      .string()
      .min(1, t('addEditPostForm.titleIsRequired'))
      .min(3, t('zod.messageNamePostShort'))
      .max(30, t('zod.messageNamePostLong')),
    title_ru: z
      .string()
      .min(1, t('addEditPostForm.titleIsRequired'))
      .min(3, t('zod.messageTransNamePostShort'))
      .max(50, t('zod.messageTransNamePostLong')),
    sections: z.array(
      z.union([
        z.object({
          type: z.literal('text'),
          content: z
            .string()
            .min(1, t('zod.messageSectionContentRequired'))
            .max(1000, t('zod.messageSectionContentLong')),
          order: z.number(),
        }),
        z.object({
          type: z.literal('image'),
          path: z.string().min(1, t('zod.messageImageRequired')).optional(),
          alt: z.string().min(1, t('zod.messageImageAltRequired')),
          order: z.number(),
        }),
      ]),
    ),
    sections_ru: z.array(
      z.union([
        z.object({
          type: z.literal('text'),
          content: z
            .string()
            .min(1, t('zod.messageSectionRuContentRequired'))
            .max(1000, t('zod.messageSectionRuContentLong')),
          order: z.number(),
        }),
        z.object({
          type: z.literal('image'),
          path: z.string().min(1, t('zod.messageImageRuRequired')).optional(),
          alt: z.string().min(1, t('zod.messageImageRuAltRequired')),
          order: z.number(),
        }),
      ]),
    ),
    favorite: z.number(),
    nofavorite: z.number(),
    views: z.number(),
  })

  type FormSchema = z.infer<typeof formSchema>

  console.log('extendedSelectedPost=', extendedSelectedPost)

  let defaultValues: IPostForm = {} as IPostForm
  if (modePost === 'edit') {
    defaultValues = {
      title: extendedSelectedPost.title,
      title_ru: extendedSelectedPost.title_ru,
      sections: extendedSelectedPost.sections || [],
      sections_ru: extendedSelectedPost.sections_ru || [],
      favorite: extendedSelectedPost.favorite,
      nofavorite: extendedSelectedPost.nofavorite,
      views: extendedSelectedPost.views,
    }
  } else if (modePost === 'add') {
    defaultValues = {
      title: '',
      title_ru: '',
      sections: [],
      sections_ru: [],
      favorite: 0,
      nofavorite: 0,
      views: 0,
    }
  }

  const {
    register,
    handleSubmit,
    // clearErrors,
    // setError,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  // Используем кастомные хуки
  const {
    fields: sectionsFields,
    addSection: addEnglishSection,
    removeSection: removeEnglishSection,
    moveSectionUp: moveEnglishSectionUp,
    moveSectionDown: moveEnglishSectionDown,
  } = useSectionsManagement(
    control,
    false,
    getValues,
    setValue,
    setSectionImages,
  )

  const {
    fields: sectionsRuFields,
    addSection: addRussianSection,
    removeSection: removeRussianSection,
    moveSectionUp: moveRussianSectionUp,
    moveSectionDown: moveRussianSectionDown,
  } = useSectionsManagement(
    control,
    true,
    getValues,
    setValue,
    setSectionImages,
  )

  const hasChanges = useFormChanges(
    modePost,
    defaultValues,
    watch,
    getValues,
    sectionImages,
  )

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await savePost(data)
  }

  // Функция для загрузки файла по URL
  const fetchFileFromUrl = async (
    url: string,
    fileName: string,
  ): Promise<File> => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const blob = await response.blob()

      // Определяем тип файла из расширения или ответа
      let fileType = blob.type
      if (!fileType || fileType === 'application/octet-stream') {
        const extension = fileName.split('.').pop()?.toLowerCase()
        const mimeTypes: { [key: string]: string } = {
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          gif: 'image/gif',
          webp: 'image/webp',
          svg: 'image/svg+xml',
        }
        fileType = mimeTypes[extension || ''] || 'image/png'
      }
      return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
      })
    } catch (error) {
      console.error('Error fetching file:', error)
      throw error
    }
  }

  const savePost = async (postForm: FormSchema) => {
    // event.preventDefault()
    const formData = createFormData(
      postForm,
      sectionImages,
      modePost,
      extendedSelectedPost,
      categoryId,
      userId,
    )
    // const formData = createFormData(postForm)
    const addedit = async () => {
      if (modePost === 'add') addBlogPost(formData)
      else if (modePost === 'edit') editBlogPost(formData)
    }
    await addedit()

    console.log('Сохранить пост -- savePost ', formData)
    handleAddEditPostFormHide()
  }

  const handleEnter = async (
    event: React.KeyboardEvent<HTMLFormElement>,
    postForm: FormSchema,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      console.log('Сохранить пост -- handleEnter ', postForm)

      const formData = createFormData(
        postForm,
        sectionImages,
        modePost,
        extendedSelectedPost,
        categoryId,
        userId,
      )
      const addedit = async () => {
        if (modePost === 'add') addBlogPost(formData)
        else if (modePost === 'edit') editBlogPost(formData)
      }
      await addedit()

      handleAddEditPostFormHide()
    }
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleAddEditPostFormHide()
      }
    }
    window.addEventListener('keyup', handleEscape)

    return () => {
      window.removeEventListener('keyup', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (modePost === 'edit') {
      for (const [key, value] of Object.entries(extendedSelectedPost)) {
        if (key in extendedSelectedPost) {
          setValue(key as keyof FormSchema, value)
          console.log('key=', key)
        }
      }
    }

    if (modePost === 'edit' && extendedSelectedPost.sections) {
      const loadExistingFiles = async () => {
        const images: { [key: string]: ImageState } = {}

        // Для оригинальных секций
        const englishPromises =
          extendedSelectedPost.sections.map(async (section, index) => {
            if (section.type === 'image' && section.path) {
              const key = `${index}_en`
              const url = production
                ? `${basicUrl.urlPostFiles}?id=${extendedSelectedPost._id}&nameImage=${section.path}`
                : `/postFiles/${section.path}`

              try {
                const file = await fetchFileFromUrl(url, section.path)
                images[key] = {
                  type: 'existing',
                  url: URL.createObjectURL(file), // Локальный URL для превью
                  previewUrl: URL.createObjectURL(file),
                  fileName: section.path,
                  file: file, // ← Теперь есть File объект!
                  alt: section.alt || '',
                }
              } catch (error) {
                console.error(`Failed to load existing file for ${key}:`, error)
                // Если не удалось загрузить, все равно сохраняем информацию
                images[key] = {
                  type: 'existing',
                  url: url, // Оригинальный URL
                  fileName: section.path,
                  alt: section.alt || '',
                }
              }
            }
          }) || []

        // Для русских секций
        const russianPromises =
          extendedSelectedPost.sections_ru?.map(async (section, index) => {
            if (section.type === 'image' && section.path) {
              const key = `${index}_ru`
              const url = production
                ? `${basicUrl.urlPostFiles}?id=${extendedSelectedPost._id}&nameImage=${section.path}`
                : `/postFiles/${section.path}`

              try {
                const file = await fetchFileFromUrl(url, section.path)
                images[key] = {
                  type: 'existing',
                  url: URL.createObjectURL(file),
                  previewUrl: URL.createObjectURL(file),
                  fileName: section.path,
                  file: file, // ← Теперь есть File объект!
                  alt: section.alt || '',
                }
              } catch (error) {
                console.error(`Failed to load existing file for ${key}:`, error)
                images[key] = {
                  type: 'existing',
                  url: url,
                  fileName: section.path,
                  alt: section.alt || '',
                }
              }
            }
          }) || []
        await Promise.all([...englishPromises, ...russianPromises])
        setSectionImages(images)
      }
      loadExistingFiles()
    }

    // initializeExistingFiles()
  }, [modePost, extendedSelectedPost])

  useEffect(() => {
    return () => {
      // Очищаем все созданные Object URL
      Object.values(sectionImages).forEach((image) => {
        if (image.type === 'new' && image.previewUrl) {
          URL.revokeObjectURL(image.previewUrl)
        }
      })
    }
  }, [sectionImages])

  useEffect(() => {
    // Сохраняем исходное состояние body
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Запрещаем скролл body при открытии формы
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleAddEditPostFormHide()
      }
    }

    window.addEventListener('keyup', handleEscape)

    return () => {
      // Восстанавливаем скролл body при закрытии формы
      document.body.style.overflow = originalStyle
      window.removeEventListener('keyup', handleEscape)
    }
  }, [handleAddEditPostFormHide])

  return (
    <>
      <form
        className={styles.editPostForm}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={async (e) => {
          await handleEnter(e, getValues())
        }}
      >
        <button
          className={styles.deleteButton}
          onClick={() => handleAddEditPostFormHide()}
        >
          <img src={close} width={24} height={24} alt="close" loading="lazy" />
        </button>
        <h2>
          {modePost === 'add'
            ? t('addEditPostForm.titleAdd')
            : t('addEditPostForm.titleEdit')}
        </h2>
        <div>
          <input
            {...register('title', { required: true })}
            type="text"
            name="title"
            className={`${styles.inputEditPost} ${
              errors.title ? styles.isInvalid : ''
            }`}
            placeholder={t('addEditPostForm.placeholderName')}
            autoFocus
          />
          {errors.title && (
            <p className={styles.titleError} role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register('title_ru', { required: true })}
            type="text"
            name="title_ru"
            className={`${styles.inputEditPost} ${
              errors.title_ru ? styles.isInvalid : ''
            }`}
            placeholder={t('addEditPostForm.placeholderNameRu')}
          />
          {errors.title_ru && (
            <p className={styles.titleError} role="alert">
              {errors.title_ru.message}
            </p>
          )}
        </div>

        {/* Sections (original language) */}
        <SectionsPanel
          addSection={addEnglishSection}
          sectionsFields={sectionsFields}
          sectionImages={sectionImages}
          isRussian={false}
          moveSectionDown={moveEnglishSectionDown}
          moveSectionUp={moveEnglishSectionUp}
          removeSection={removeEnglishSection}
          register={register}
          setSectionImages={setSectionImages}
          getValues={getValues}
          setValue={setValue}
          t={t}
          sectionErrors={errors.sections}
        />

        {/* Sections (Russian language) */}
        <SectionsPanel
          addSection={addRussianSection}
          sectionsFields={sectionsRuFields}
          sectionImages={sectionImages}
          isRussian={true}
          moveSectionDown={moveRussianSectionDown}
          moveSectionUp={moveRussianSectionUp}
          removeSection={removeRussianSection}
          register={register}
          setSectionImages={setSectionImages}
          getValues={getValues}
          setValue={setValue}
          t={t}
          sectionErrors={errors.sections_ru}
        />

        <div className={styles.footerInputs}>
          <div className={styles.labelsWrapper}>
            <label>{t('addEditPostForm.placeholderFavorite') + ':'}</label>
            <label>{t('addEditPostForm.placeholderNoFavorite') + ':'}</label>
            <label>{t('addEditPostForm.placeholderViews') + ':'}</label>
          </div>

          <div className={styles.inputsWrapper}>
            <input
              {...register('favorite', { required: true, valueAsNumber: true })}
              type="number"
              name="favorite"
              className={styles.inputFavoritePost}
            />
            <input
              {...register('nofavorite', {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              name="nofavorite"
              className={styles.inputNoFaviritePost}
            />
            <input
              {...register('views', { required: true, valueAsNumber: true })}
              type="number"
              name="views"
              className={styles.inputViewsPost}
            />
          </div>
        </div>
        <div>
          <input
            type="submit"
            value={
              modePost === 'add'
                ? t('addEditPostForm.addPost')
                : t('addEditPostForm.savePost')
            }
            className={styles.buttonSubmit}
            disabled={
              !isValid || isSubmitting || (modePost === 'edit' && !hasChanges)
            }
          />
        </div>
      </form>
      <div
        className={styles.overlay}
        onClick={() => handleAddEditPostFormHide()}
      ></div>
    </>
  )
}
