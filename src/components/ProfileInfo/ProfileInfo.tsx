// components/ProfileInfo.tsx
import React, { useState, useCallback } from 'react'
import axiosIC from '../../utilita/axiosIC.ts'
import toast from 'react-hot-toast'
import { useGlobalState } from '../../useGlobalState.ts'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { basicUrl, basicColor } from '../../utilita/default.ts'
import { IUser } from '../../utilita/modelUser.ts'
import styles from './ProfileInfo.module.css'

interface Inputs {
  firstName: string
  lastName: string
  bio: string
}

interface ProfileInfoProps {
  profile: IUser
  isEditing: boolean
  onEditToggle: () => void
  setProfile: React.Dispatch<React.SetStateAction<IUser | null>>
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  onEditToggle,
  setProfile,
}) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const [, setFileName] = useState('')
  const [, setLastName] = useState('')
  const [, setBio] = useState('')
  const userId = JSON.parse(localStorage.getItem('userData')!).userId

  // const isFormValid =
  //   firstName?.trim() !== '' &&
  //   lastName?.trim() !== '' &&
  //   bio?.trim() !== '' &&
  //   !errors.firstName &&
  //   !errors.lastName &&
  //   !errors.bio;

  // const [formData, setFormData] = useState({
  //   firstName: profile.firstName || '',
  //   lastName: profile.lastName || '',
  //   bio: profile.bio || '',
  // })

  const { t } = useTranslation()

  const formSchema = z.object({
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
  })

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
    },
  })

  const first = watch('firstName')
  const last = watch('lastName')
  const biograf = watch('bio')

  console.log('Fields:', { first, last, biograf })
  console.log(
    'All empty?',
    first?.trim() === '' && last?.trim() === '' && biograf?.trim() === '',
  )
  console.log('Errors:', errors)
  console.log('Is Submitting:', isSubmitting)

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const onSubmitAuth: SubmitHandler<Inputs> = async (
    dataProfileForm: Inputs,
  ) => {
    console.log('profile')
    await handleSave(dataProfileForm)
  }

  const handleSave = async (formData: Inputs) => {
    setIsLoading(true)
    try {
      // headers ?
      const response = await axiosIC.put<{
        success: boolean
        userProfile?: IUser
        message: string
        forUserId: string
      }>(`${basicUrl.urlUser}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const resServer = response.data

      if (resServer.success && resServer.userProfile) {
        if (resServer.forUserId && resServer.forUserId === userId) {
          myToast(resServer.message, basicColor.green)
          setProfile(resServer.userProfile)
          onEditToggle()
        }
      } else {
        if (resServer.forUserId && resServer.forUserId === userId)
          myToast(response.data.message, basicColor.red)
      }
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error)
      alert('Ошибка при сохранении профиля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // setFormData({
    //   firstName: profile.firstName || '',
    //   lastName: profile.lastName || '',
    //   bio: profile.bio || '',
    // })
    setFileName('')
    setLastName('')
    setBio('')
    setValue('firstName', '')
    setValue('lastName', '')
    setValue('bio', '')
    onEditToggle()
    clearErrors()
  }

  if (isEditing) {
    return (
      <div className={styles.profileInfoEdit}>
        <h3 className={styles.profileHeaderEdit}>
          {t('profilePage.profileInfo.header')}
        </h3>

        {/* <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Введите имя"
          />
        </div> */}
        <div className={styles.containerInput}>
          <div className={styles.inputField}>
            <label className={styles.labelInput} htmlFor="firstName">
              {t('profilePage.form.fieldFirstName')}
            </label>
            <div style={{ display: 'flex' }}>
              <input
                {...register('firstName')}
                name="firstName"
                id="inputFirstName"
                // onChange={(e) => setFileName(e.target.value)}
                type="text"
                className={styles.itemInput} // openInput'
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
            <label className={styles.labelInput} htmlFor="lastName">
              {t('profilePage.form.fieldLastName')}
            </label>
            <div style={{ display: 'flex' }}>
              <input
                {...register('lastName')}
                name="lastName"
                id="inputLastName"
                // onChange={(e) => setLastName(e.target.value)}
                type="text"
                className={styles.itemInput} // openInput'
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
            <label className={styles.labelInput} htmlFor="bio">
              {t('profilePage.form.bio')}
            </label>
            <div style={{ display: 'flex' }}>
              <textarea
                {...register('bio')}
                name="bio"
                id="inputBio"
                // onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={styles.itemInput} // openInput'
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
        </div>

        <div className={styles.formProfileEditAction}>
          <input
            type="submit"
            name="enter"
            value={t('profilePage.form.enter')}
            onClick={handleSubmit(onSubmitAuth)}
            className={styles.btnSubmit}
            style={{ marginRight: 10 }}
            disabled={
              (first?.trim() === '' &&
                last?.trim() === '' &&
                biograf?.trim() === '') ||
              // watch('firstName') === '' ||
              // watch('lastName') === '' ||
              // watch('bio') === '' ||
              // getValues('firstName') === '' ||
              // getValues('lastName') === '' ||
              // getValues('bio') === '' ||
              isSubmitting ||
              // !Object.keys(dirtyFields).length
              (errors.firstName?.message ? true : false) ||
              (errors.lastName?.message ? true : false) ||
              (errors.bio?.message ? true : false)
            }
          />
          <input
            type="button"
            name="cancel"
            value={t('profilePage.form.cancel')}
            className={styles.btnCancel}
            onClick={handleCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.profileInfo}>
      <div className={styles.infoHeader}>
        <h3>{t('adminUser.profileInfo.infoHeader')}</h3>
        <button onClick={onEditToggle} className={styles.btnEdit}>
          {t('profilePage.profileInfo.edit')}
        </button>
      </div>

      <div className={styles.infoContent}>
        {profile.firstName || profile.lastName ? (
          <div className={styles.infoItem}>
            <div className={styles.bg2}>
              <strong className={styles.strongField}>
                {t('profilePage.profileInfo.name')}
              </strong>
              <p className={styles.field}>
                {profile.firstName} {profile.lastName}
              </p>
            </div>
          </div>
        ) : (
          <p className={styles.noInfo}>
            {t('profilePage.profileInfo.noInformation')}
          </p>
        )}

        {profile.bio ? (
          <div className={styles.infoItem}>
            <div className={styles.bg1}>
              <strong className={styles.strongField}>
                {t('profilePage.profileInfo.bio')}
              </strong>
              <p className={styles.field}> {profile.bio}</p>
            </div>{' '}
          </div>
        ) : (
          <p className={styles.noInfo}>
            {t('profilePage.profileInfo.noInformation')}
          </p>
        )}
      </div>
    </div>
  )
}
