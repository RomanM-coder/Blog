import React, { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IUserForm } from '../../../utilita/modelUserForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import x from '../../../assets/static/x.svg'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import styles from './AddEditUserForm.module.css'

interface AddEditUserFormProps {
  handleAddEditUserFormHide: () => void
  modeUser: 'add' | 'edit'
  selectedUser: IUserForm
  addUser: (user: FormData) => void
  editUser: (user: FormData) => void
  votepost: string[] // id всех постов
  votecomment: string[] // id всех комментов
}

export const AddEditUserForm: React.FC<AddEditUserFormProps> = ({
  handleAddEditUserFormHide,
  modeUser,
  selectedUser,
  addUser,
  editUser,
  votepost,
  votecomment,
}) => {
  const [isFormReady, setIsFormReady] = useState(false)
  const { t } = useTranslation()
  // const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  const renderCount = useRef(0)

  const formSchema = z.object({
    email: z.string().email({ message: t('zod.messageEmailUncorrect') }),
    firstName: z
      .string()
      .max(30, { message: t('zod.firstName.tooLong') }) // 'Имя не может быть длиннее 30 символов'
      // .regex(/^[\p{L}]+(?:[\s\-'][\p{L}]+)*$/u, { // запрещено всё кроме букв
      // .regex(/^[\p{L}\d]+(?:[\s\-'][\p{L}\d]+)*$/u, { // пусто - ошибка
      .regex(/^[\p{L}\d]*(?:[\s\-'][\p{L}\d]+)*$/u, {
        // разрешено "Иван123",Мария-Анна","John Doe","Александр 2","O'Connor"
        message: t('zod.firstName.invalidChars'),
      }) // 'Имя может содержать только буквы, пробелы, дефисы и апострофы'
      .transform((val) => val.trim())
      .refine(
        (val) => {
          // Проверка на несколько пробелов подряд
          return !/\s{2,}/.test(val)
        },
        {
          message: t('zod.firstName.doubleSpaces'), // 'Уберите лишние пробелы'
        },
      ),
    lastName: z
      .string()
      .max(30, { message: t('zod.lastName.tooLong') }) // 'Фамилия не может быть длиннее 30 символов'
      // .regex(/^[\p{L}]+(?:[\s\-'][\p{L}]+)*$/u, { // запрещено всё кроме букв
      // .regex(/^[\p{L}\d]+(?:[\s\-'][\p{L}\d]+)*$/u, {
      .regex(/^[\p{L}\d]*(?:[\s\-'][\p{L}\d]+)*$/u, {
        // разрешено "Иван123",Мария-Анна","John Doe","Александр 2","O'Connor"
        message: t('zod.lastName.invalidChars'),
      }) // 'Фамилия может содержать только буквы, пробелы, дефисы и апострофы'
      .transform((val) => val.trim())
      .refine(
        (val) => {
          // Проверка на несколько пробелов подряд
          return !/\s{2,}/.test(val)
        },
        {
          message: t('zod.lastName.doubleSpaces'), // 'Уберите лишние пробелы'
        },
      ),

    bio: z.string().max(100, { message: t('zod.bio.tooLong') }), // 'bio не может быть длиннее 100 символов'
    role: z.enum(['user', 'admin', 'moderator']),
    createdAt: z.date(),
    lastLogin: z.date().nullable(),
    confirmed: z.boolean().default(false),
    blocked: z.boolean().default(false),
    votepost: z.array(z.string()).default([]),
    votecomment: z.array(z.string()).default([]),
    commentsCount: z.number(),
    postsPublishedId: z.array(z.string()).default([]),
  })

  type FormSchema = z.infer<typeof formSchema>

  let defaultValues: IUserForm = {} as IUserForm
  if (modeUser === 'edit') {
    defaultValues = {
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      bio: selectedUser.bio,
      role: selectedUser.role,
      avatar: selectedUser.avatar,
      createdAt: selectedUser.createdAt
        ? new Date(selectedUser.createdAt)
        : new Date(),
      lastLogin: selectedUser.lastLogin
        ? new Date(selectedUser.lastLogin)
        : null,
      confirmed: selectedUser.confirmed,
      blocked: selectedUser.blocked,
      votepost: selectedUser.votepost,
      votecomment: selectedUser.votecomment,
      commentsCount: selectedUser.commentsCount,
      postsPublishedId: selectedUser.postsPublishedId,
    }
  } else if (modeUser === 'add') {
    defaultValues = {
      email: '',
      firstName: '',
      lastName: '',
      bio: '',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      lastLogin: null,
      confirmed: false,
      blocked: false,
      votepost: [],
      votecomment: [],
      commentsCount: 0,
      postsPublishedId: [],
    }
  }

  console.log('defaultValues=', defaultValues)

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting, dirtyFields },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    savePost(data)
  }

  const createFormData = (editUserForm: FormSchema) => {
    const formData = new FormData()

    formData.append('id', selectedUser._id || '')
    formData.append('email', editUserForm.email)
    formData.append('firstName', editUserForm.firstName)
    formData.append('lastName', editUserForm.lastName)
    formData.append('bio', editUserForm.bio)
    formData.append('role', editUserForm.role)
    formData.append('blocked', editUserForm.blocked ? 'true' : 'false')
    formData.append('confirmed', editUserForm.confirmed ? 'true' : 'false')
    formData.append('createdAt', editUserForm.createdAt.toISOString())
    // Проверка на "позже"
    if (editUserForm.lastLogin) {
      const newLastLogin =
        editUserForm.createdAt.getTime() > editUserForm.lastLogin!.getTime()
          ? 'null'
          : editUserForm.lastLogin!.toISOString()
      formData.append('lastLogin', newLastLogin)
    } else {
      const newLastLogin = null
      formData.append('lastLogin', newLastLogin!)
    }
    // formData.append('lastLogin', newLastLogin)
    formData.append('votepost', JSON.stringify(editUserForm.votepost))
    formData.append('votecomment', JSON.stringify(editUserForm.votecomment))
    formData.append('commentsCount', JSON.stringify(editUserForm.commentsCount))
    formData.append(
      'postsPublishedId',
      JSON.stringify(editUserForm.postsPublishedId),
    )
    console.log('editUserForm.votepost=', editUserForm.votepost)
    console.log('formData=', formData)

    return formData
  }

  const savePost = async (userForm: FormSchema) => {
    // event.preventDefault()
    const formData = createFormData(userForm)
    console.log('formData=', formData)

    const addedit = async () => {
      if (modeUser === 'add') addUser(formData)
      else if (modeUser === 'edit') editUser(formData)
    }
    await addedit()

    console.log('Сохранить юзера -- button ', formData)
    handleAddEditUserFormHide()
  }

  const handleEnter = async (
    event: React.KeyboardEvent<HTMLFormElement>,
    userForm: FormSchema,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      const formData = createFormData(userForm)

      const addedit = async () => {
        if (modeUser === 'add') addUser(formData)
        else if (modeUser === 'edit') editUser(formData)
      }
      await addedit()

      handleAddEditUserFormHide()
    }
  }

  const selectedPosts = watch('votepost')
  const selectedComments = watch('votecomment')
  const selectedPublishedId = watch('postsPublishedId')

  const handleChangePost = (vote: string) => {
    const currentSelectedPosts = [...selectedPosts]
    if (currentSelectedPosts.includes(vote)) {
      const index = currentSelectedPosts.indexOf(vote)
      if (index !== -1) currentSelectedPosts.splice(index, 1) // Удаляем при отмене выбора
    } else {
      currentSelectedPosts.push(vote) // Добавляем при выборе
    }
    setValue('votepost', currentSelectedPosts) // Обновляем значение в форме
  }

  const handleChangePublishedId = (postId: string) => {
    const currentSelectedPublishedId = [...selectedPublishedId]
    if (currentSelectedPublishedId.includes(postId)) {
      const index = currentSelectedPublishedId.indexOf(postId)
      if (index !== -1) currentSelectedPublishedId.splice(index, 1) // Удаляем при отмене выбора
    } else {
      currentSelectedPublishedId.push(postId) // Добавляем при выборе
    }
    setValue('postsPublishedId', currentSelectedPublishedId) // Обновляем значение в форме
  }

  const handleChangeComment = (vote: string) => {
    const currentSelectedComments = [...selectedComments]
    if (currentSelectedComments.includes(vote)) {
      const index = currentSelectedComments.indexOf(vote)
      if (index !== -1) currentSelectedComments.splice(index, 1) // Удаляем при отмене выбора
    } else {
      currentSelectedComments.push(vote) // Добавляем при выборе
    }
    setValue('votecomment', currentSelectedComments) // Обновляем значение в форме
  }

  useEffect(() => {
    renderCount.current += 1
    console.log(`🔄 AdimnUser render #${renderCount.current} at ${Date.now()}`)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleAddEditUserFormHide()
      }
    }
    window.addEventListener('keyup', handleEscape)

    return () => {
      window.removeEventListener('keyup', handleEscape)
    }
  }, [])

  // useEffect(() => {

  //   if (!selectedUser || typeof selectedUser !== 'object') {
  //     console.log('❌ selectedUser не объект!')
  //     return
  //   }

  //   if (modeUser === 'edit') {
  //     console.log('selectedUser', selectedUser)

  //     for (const [key, value] of Object.entries(selectedUser)) {
  //       if (key in selectedUser) {
  //         if (key === 'lastLogin' && !selectedUser.lastLogin) {
  //           setValue('lastLogin', null)
  //         } else setValue(key as keyof FormSchema, value)
  //         console.log(key, typeof value)
  //       }
  //     }
  //   } else setValue('lastLogin', null)
  // }, [selectedUser._id, modeUser])

  useEffect(() => {
    if (modeUser === 'edit' && selectedUser) {
      // Копируем объект и преобразуем даты
      const formData = {
        ...selectedUser,
        createdAt: new Date(selectedUser.createdAt),
        lastLogin: selectedUser.lastLogin
          ? new Date(selectedUser.lastLogin)
          : null,
      }
      // Убираем только системные поля MongoDB
      delete formData._id
      console.log('formData=', formData)
      // 🚀 Один вызов — вся форма заполнена!
      reset(formData)
    }
  }, [selectedUser._id, modeUser])

  useEffect(() => {
    setIsFormReady(true)
  }, [])

  // Условный рендеринг
  if (!isFormReady) {
    return <div>Загрузка формы...</div>
  }

  console.log('votepost=', votepost)

  return (
    <>
      <form
        className={styles.editUserForm}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          handleEnter(e, getValues())
        }}
      >
        <button
          className={styles.deleteButton}
          onClick={() => handleAddEditUserFormHide()}
        >
          <img
            src={x}
            width={20}
            height={20}
            alt="X"
            style={{ margin: '3px 0 0 0' }}
            loading="lazy"
          />
        </button>
        <h2>
          {modeUser === 'add'
            ? t('addEditUserForm.titleAdd')
            : t('addEditUserForm.titleEdit')}
        </h2>
        <div className={styles.fieldsWrapper}>
          <div>
            <input
              {...register('email', { required: true })}
              type="text"
              name="email"
              className={`${styles.inputEditUser} ${
                errors.email ? 'is-invalid' : ''
              }`}
              placeholder={t('addEditUserForm.placeholderEmail')}
              autoFocus
            />
            {errors.email?.type === 'required' && (
              <p role="alert">{t('addEditUserForm.emailIsRequired')}</p>
            )}
          </div>
          <div className={styles.inputField}>
            <div style={{ display: 'flex' }}>
              <input
                {...register('firstName')}
                name="firstName"
                id="inputFirstName"
                // onChange={(e) => setFileName(e.target.value)}
                type="text"
                className={styles.inputEditUser} // openInput'
                placeholder={t('profilePage.form.placeholderFirstName')}
                autoComplete="firstName"
              />
            </div>
            {errors.firstName && (
              <span role="alert" className={styles.profile_error}>
                {errors.firstName?.message}
              </span>
            )}
          </div>

          <div className={styles.inputField}>
            <div style={{ display: 'flex' }}>
              <input
                {...register('lastName')}
                name="lastName"
                id="inputLastName"
                // onChange={(e) => setLastName(e.target.value)}
                type="text"
                className={styles.inputEditUser} // openInput'
                placeholder={t('profilePage.form.placeholderLastName')}
                autoComplete="lastName"
              />
            </div>
            {errors.lastName && (
              <span role="alert" className={styles.profile_error}>
                {errors.lastName?.message}
              </span>
            )}
          </div>

          <div className={styles.inputField}>
            <div style={{ display: 'flex' }}>
              <textarea
                {...register('bio')}
                name="bio"
                id="inputBio"
                // onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={styles.inputEditUser} // openInput'
                placeholder={t('profilePage.form.placeholderBio')}
                autoComplete="bio"
              />
            </div>
            {errors.bio && (
              <span role="alert" className={styles.profile_error}>
                {errors.bio?.message}
              </span>
            )}
          </div>

          <div>
            <input
              {...register('role', { required: true })}
              type="text"
              name="role"
              className={`${styles.inputEditUser} ${
                errors.role ? 'is-invalid' : ''
              }`}
              placeholder={t('addEditUserForm.placeholderRole')}
            />
            {errors.role?.type === 'required' && (
              <p role="alert">{t('addEditUserForm.roleIsRequired')}</p>
            )}
          </div>
          <div className={styles.wrapperCheck}>
            <input
              {...register('confirmed', { required: true })}
              type="checkbox"
              name="confirmed"
              // className={styles.inputEditUser}
            />
            <p>{t('addEditUserForm.placeholderConfirmed')}</p>
          </div>
          <div className={styles.wrapperCheck}>
            <input
              {...register('blocked', { required: true })}
              type="checkbox"
              name="blocked"
              // className={styles.inputEditUser}
            />
            <p>{t('addEditUserForm.placeholderBlocked')}</p>
          </div>
          <div className={styles.dateTime}>
            <p>{t('addEditUserForm.placeholderCreatedAt')}</p>

            <Controller
              name="createdAt"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                // Деструктурируем field, убирая ref и onChange
                const { ref, onChange, ...fieldProps } = field
                return (
                  <Flatpickr
                    {...fieldProps}
                    className={styles.inputDatetime}
                    options={{
                      enableTime: true, // Включает выбор времени
                      noCalendar: false, // Показывает календарь
                      // dateFormat: 'Y-m-d H:i', // Формат даты и времени
                      // dateFormat: 'Y-m-dTH:i[Z]', // Формат ISO с временной меткой UTC
                      time_24hr: true, // 24-часовой формат
                      // utc: true, // Используем UTC-формат
                    }}
                    value={field.value} // ← Уже не undefined
                    onChange={(date) => field.onChange(date[0])}
                  />
                )
              }}
            />
            {errors.createdAt?.type === 'required' && (
              <p role="alert">{t('addEditUserForm.createdAtRequired')}</p>
            )}
          </div>
          <div className={styles.dateTime}>
            <p className={styles.lableDateTime}>
              {t('addEditUserForm.placeholderLastLogin')}
            </p>

            <Controller
              name="lastLogin"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                // Деструктурируем field, убирая ref и onChange
                const { ref, onChange, ...fieldProps } = field
                return (
                  <Flatpickr
                    {...fieldProps}
                    className={styles.inputDatetime}
                    options={{
                      enableTime: true, // Включает выбор времени
                      noCalendar: false, // Показывает календарь
                      // dateFormat: 'Y-m-d H:i', // Формат даты и времени
                      // dateFormat: 'Y-m-dTH:i[Z]', // Формат ISO с временной меткой UTC
                      time_24hr: true, // 24-часовой формат
                      // utc: true, // Используем UTC-формат
                    }}
                    value={field.value || ''} // ← Уже не undefined
                    onChange={(date) => field.onChange(date[0] || null)}
                  />
                )
              }}
            />

            {errors.lastLogin?.type === 'required' && (
              <p role="alert">{t('addEditUserForm.lastLoginRequired')}</p>
            )}
          </div>

          <div>
            <p>{t('addEditUserForm.checkPosts')}</p>
            <div className={styles.wrapperPost}>
              {votepost.length > 0 &&
                votepost.map((vote) => (
                  <label key={vote} className={styles.listPost}>
                    <input
                      // {...register('votepost')}
                      type="checkbox"
                      name={vote}
                      className={styles.inputEditPost}
                      checked={
                        selectedPosts ? selectedPosts.includes(vote) : false
                      }
                      onChange={() => handleChangePost(vote)}
                    />
                    {vote}
                  </label>
                ))}
            </div>
          </div>
          <div>
            <p>{t('addEditUserForm.checkComments')}</p>
            <div className={styles.wrapperComment}>
              {votecomment.length > 0 &&
                votecomment.map((vote) => (
                  <label key={vote} className={styles.listComment}>
                    <input
                      // {...register('votecomment')}
                      type="checkbox"
                      name={vote}
                      // className={styles.inputEditUser}
                      checked={
                        selectedComments
                          ? selectedComments.includes(vote)
                          : false
                      }
                      onChange={() => handleChangeComment(vote)}
                    />
                    {vote}
                  </label>
                ))}
            </div>
          </div>
          <div>
            <p>{t('addEditUserForm.commentsCount')}</p>
            <input
              {...register('commentsCount', {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              name="commentsCount"
              className={styles.inputEditUser}
              placeholder={t('addEditUserForm.placeholderCommentsCount')}
            />
          </div>

          <div>
            <p>{t('addEditUserForm.checkPostsPublishedId')}</p>
            <div className={styles.wrapperComment}>
              {votecomment.length > 0 &&
                votecomment.map((id) => (
                  <label key={id} className={styles.listPublishedId}>
                    <input
                      // {...register('postsPublishedId')}
                      type="checkbox"
                      name={id}
                      // className={styles.inputEditUser}
                      checked={
                        selectedComments ? selectedComments.includes(id) : false
                      }
                      onChange={() => handleChangePublishedId(id)}
                    />
                    {id}
                  </label>
                ))}
            </div>
          </div>
        </div>
        <div>
          <input
            type="submit"
            value={
              modeUser === 'add'
                ? t('addEditUserForm.addUser')
                : t('addEditUserForm.saveUser')
            }
            className={styles.buttonSubmit}
            disabled={
              !isValid || isSubmitting || !Object.keys(dirtyFields).length
            }
          />
        </div>
      </form>
      <div
        className={styles.overlay}
        onClick={() => handleAddEditUserFormHide()}
      ></div>
    </>
  )
}
