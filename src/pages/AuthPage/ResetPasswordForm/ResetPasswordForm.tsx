import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useResetCheckingKeyboard } from './useResetCheckingKeyboard.hook.ts'
import { useResetPasswordByToken } from '../useResetPasswordByToken.ts'
import { useResetPassword } from '../useResetPassword.ts'
import { basicColor } from '../../../utilita/default.ts'
import ReCAPTCHA from 'react-google-recaptcha'
import visibilityIcon from '../../../assets/static/eye-light.svg'
import visibilityOffIcon from '../../../assets/static/eye-slash.svg'
import close from '../../../assets/static/close_big.svg'
import styles from './ResetPasswordForm.module.css'

interface ResetPasswordFormInputs {
  token: string | undefined
  email: string
  newPassword: string
  confirmNewPassword: string
  captchaToken: string
}

interface ResetPasswordApiInputs {
  token: string | undefined
  email: string
  newPassword: string
  captchaToken: string
}
// Форма для ввода нового пароля
export const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [visibility, setVisibility] = useState(false)
  const [visibilityConfirm, setVisibilityConfirm] = useState(false)

  const isResetPassword = location.pathname.includes('/reset-password/')
  const resetPasswordToken = isResetPassword ? token : null
  const hasResetPasswordRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>()
  // const isFirstRender = useRef(true)

  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const catchErrors = (error: unknown, name: string) => {
    if (axios.isAxiosError(error)) {
      console.log(name + ':', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message,
      })

      const errorMessage = error.response?.data?.message || 'Unknown error'
      myToast(errorMessage, basicColor.red)
    } else {
      const errorMessage =
        error instanceof Error
          ? `Global error: ${error.message}`
          : `Global error: ${String(error)}`
      myToast(errorMessage, basicColor.red)
    }
  }

  const getFormSchema = (t: TFunction) =>
    z
      .object({
        token: z.string(),
        email: z.string().email({ message: t('zod.messageEmailUncorrect') }),
        newPassword: z
          .string()
          .min(1, t('zod.messageNewPasswordRequired'))
          .min(8, t('zod.messageShort'))
          .max(20, t('zod.messageLong'))
          .refine((value) => /[a-z]/.test(value), {
            message: t('zod.messageLowercase'),
          })
          .refine((value) => /[A-Z]/.test(value), {
            message: t('zod.messageUppercase'),
          })
          .refine((value) => /[^0-9a-zA-Z\s]/.test(value), {
            message: t('zod.messageSymbols'),
          })
          .refine((value) => /[0-9]/.test(value), {
            message: t('zod.messageNumber'),
          }),
        confirmNewPassword: z
          .string()
          .min(1, t('zod.messageConfirmNewPasswordRequired'))
          .min(8, t('zod.messageShort'))
          .max(20, t('zod.messageLong'))
          .refine((value) => /[a-z]/.test(value), {
            message: t('zod.messageLowercase'),
          })
          .refine((value) => /[A-Z]/.test(value), {
            message: t('zod.messageUppercase'),
          })
          .refine((value) => /[^0-9a-zA-Z\s]/.test(value), {
            message: t('zod.messageSymbols'),
          })
          .refine((value) => /[0-9]/.test(value), {
            message: t('zod.messageNumber'),
          }),
        captchaToken: z
          .string()
          .min(1, { message: t('zod.messageConfirmCaptcha') }),
      })
      .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: t('auth.resetForm.toast.messagePasswordsDoNotMatch'),
        path: ['confirmNewPassword'],
      })

  const formSchema = useMemo(() => getFormSchema(t), [i18n.language])

  // const {
  //   register,
  //   handleSubmit,
  //   clearErrors,
  //   setValue,
  //   watch,
  //   formState: { errors, isSubmitting },
  // } = useForm<ResetPasswordFormInputs>({
  //   resolver: zodResolver(formSchema),
  //   mode: 'onChange',
  //   defaultValues: {
  //     token: token,
  //     email: '',
  //     newPassword: '',
  //     confirmNewPassword: '',
  //   },
  // })

  const methods = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      token: token,
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      captchaToken: '',
    },
  })

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = methods

  const watchedEmail = watch('email')
  const watchedNewPassword = watch('newPassword')
  const watchedConfirmNewPassword = watch('confirmNewPassword')

  const {
    checkingKeyboardEmail,
    checkingKeyboardNewPassword,
    checkingKeyboardConfirmNewPassword,
  } = useResetCheckingKeyboard({
    myToast,
    setValue,
    timerRef,
  })

  const { resetPasswordByToken } = useResetPasswordByToken({
    myToast,
    catchErrors,
    token,
  })

  const { resetPassword } = useResetPassword({
    myToast,
    catchErrors,
  })

  const hendleVisibilityOff = () => {
    setVisibility(false)
  }

  const hendleVisibility = () => {
    setVisibility(true)
  }

  const hendleVisibilityConfirmOff = () => {
    setVisibilityConfirm(false)
  }

  const hendleVisibilityConfirm = () => {
    setVisibilityConfirm(true)
  }

  const handleClear = () => {
    setValue('email', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleCancel = () => {
    navigate('/auth')
  }

  const onCaptchaChange = (token: string | null) => {
    setCaptchaValue(token)
    // Устанавливаем значение в форму
    setValue('captchaToken', token || '', {
      shouldValidate: true,
      shouldDirty: true,
    })

    if (token) {
      clearErrors('captchaToken')
    }
  }

  const onCaptchaExpired = () => {
    setCaptchaValue(null)
    setValue('captchaToken', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmitResetPassword: SubmitHandler<ResetPasswordFormInputs> = async (
    resetForm,
  ) => {
    console.log('resetPasswordForm=', resetForm)

    if (resetForm.newPassword === resetForm.confirmNewPassword) {
      const apiData: ResetPasswordApiInputs = {
        token: resetForm.token,
        email: resetForm.email,
        newPassword: resetForm.newPassword,
        captchaToken: resetForm.captchaToken,
      }
      await resetPassword(apiData)
    } else {
      myToast(
        t('auth.resetForm.toast.messagePasswordsDoNotMatch'),
        basicColor.orange,
      )
    }
  }

  const RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

  const isFormEmpty =
    !watchedEmail.trim() ||
    !watchedNewPassword.trim() ||
    !watchedConfirmNewPassword.trim()

  const isSubmitDisabled =
    // каптча
    !captchaValue ||
    // 0. isSubmitting
    isSubmitting ||
    // 1. Пустые поля
    isFormEmpty ||
    // 2. Ошибки валидации
    !!(
      errors.newPassword?.message ||
      errors.confirmNewPassword?.message ||
      errors.email?.message
    )

  useEffect(() => {
    const forgetPassword = async () => {
      if (resetPasswordToken && !hasResetPasswordRef.current) {
        hasResetPasswordRef.current = true
        try {
          await resetPasswordByToken()
        } catch (error) {
          console.log('forgetPassword failed:', error)
        }
      }
    }

    forgetPassword()
  }, [resetPasswordToken])

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false
  //     // Очищаем ошибки после первого рендера
  //     const timer = setTimeout(() => {
  //       // clearErrors()
  //     }, 100)
  //     return () => clearTimeout(timer)
  //   }
  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current)
  //     }
  //   }
  // }, [])

  // Обновляем форму при смене языка
  // useEffect(() => {
  //   // Сбрасываем форму с теми же значениями, но с новым resolver
  //   reset(
  //     {
  //       token: token,
  //       email: watch('email'),
  //       newPassword: watch('newPassword'),
  //       confirmNewPassword: watch('confirmNewPassword'),
  //     },
  //     {
  //       keepValues: false, // обязательно! применяем новые правила валидации
  //     },
  //   )
  // }, [i18n.language, reset, token])

  useEffect(() => {
    // 1. Очищаем старые ошибки (но не сбрасываем поля!)
    clearErrors()

    // 2. Перезапускаем валидацию со старыми значениями
    // Форма сама пересчитает ошибки с новыми сообщениями
    trigger()
  }, [i18n.language, clearErrors, trigger])

  return (
    <div className={styles.row}>
      <div className={styles.col}>
        <h1>{t('auth.resetForm.title')}</h1>

        <form className={styles.authForm}>
          <div className={styles.cardBlue}>
            <input type="hidden" name="token" value={token} />
            <div className={styles.inputField}>
              <label className={styles.labelEmailInput} htmlFor="email">
                {t('auth.form.fieldEmail')}
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  {...register('email', {
                    required: true,
                    pattern: RegExp,
                  })}
                  id="resetUserEmail"
                  type="text"
                  name="email"
                  onChange={checkingKeyboardEmail}
                  className={styles.yellowInput}
                  placeholder={t('auth.form.placeholderEmail')}
                  autoComplete="email"
                />
                <AnimatePresence>
                  {watchedEmail && (
                    <motion.div
                      key="email-clear"
                      initial={{ opacity: 0, rotate: 0, x: -30 }}
                      animate={{ opacity: 1, rotate: 90, x: 0 }}
                      exit={{ opacity: 0, rotate: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex' }}
                    >
                      <img
                        src={close}
                        width={24}
                        height={24}
                        alt="clear"
                        onClick={handleClear}
                        className={styles.emailClearIcon}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.email && (
                <span role="alert" className={styles.reset_error}>
                  {errors.email?.message}
                </span>
              )}
            </div>
            <div style={{ display: 'none' }}>
              <input type="password" />
            </div>
            <div className={styles.inputField}>
              <label
                className={styles.labelPasswordInput}
                htmlFor="newPassword"
              >
                {t('auth.resetForm.fieldNewPassword')}
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  {...register('newPassword', {
                    required: t('auth.resetForm.newPasswordRequired'),
                  })}
                  id="newPassword"
                  autoComplete="off"
                  data-lpignore="true"
                  onChange={checkingKeyboardNewPassword}
                  type={visibility ? 'text' : 'password'}
                  className={styles.yellowInput}
                  placeholder={t('auth.resetForm.placeholderNewPassword')}
                />
                {visibility ? (
                  <div className={styles.containerVisibilityIcon}>
                    <img
                      src={visibilityOffIcon}
                      onClick={hendleVisibilityOff}
                      className={styles.passwordVisibilityOffIcon}
                      alt="eye-slash"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={styles.containerVisibilityIcon}>
                    <img
                      src={visibilityIcon}
                      onClick={hendleVisibility}
                      className={styles.passwordVisibilityIcon}
                      alt="eye"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
              {errors.newPassword && (
                <span role="alert" className={styles.reset_error}>
                  {errors.newPassword?.message}
                </span>
              )}
            </div>
            <div style={{ display: 'none' }}>
              <input type="password" />
            </div>
            <div className={styles.inputField}>
              <label
                className={styles.labelPasswordInput}
                htmlFor="confirmNewPassword"
              >
                {t('auth.resetForm.fieldConfirmNewPassword')}
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  {...register('confirmNewPassword', {
                    required: t('auth.resetForm.confirmNewPasswordRequired'),
                  })}
                  id="confirmNewPassword"
                  autoComplete="off"
                  data-lpignore="true"
                  onChange={checkingKeyboardConfirmNewPassword}
                  type={visibilityConfirm ? 'text' : 'password'}
                  className={styles.yellowInput}
                  placeholder={t(
                    'auth.resetForm.placeholderConfirmNewPassword',
                  )}
                />
                {visibilityConfirm ? (
                  <div className={styles.containerVisibilityIcon}>
                    <img
                      src={visibilityOffIcon}
                      onClick={hendleVisibilityConfirmOff}
                      className={styles.passwordVisibilityOffIcon}
                      alt="eye-slash"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={styles.containerVisibilityIcon}>
                    <img
                      src={visibilityIcon}
                      onClick={hendleVisibilityConfirm}
                      className={styles.passwordVisibilityIcon}
                      alt="eye"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
              {errors.confirmNewPassword && (
                <span role="alert" className={styles.reset_error}>
                  {errors.confirmNewPassword?.message}
                </span>
              )}
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              className={styles.captcha}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY!}
              onChange={onCaptchaChange}
              onExpired={onCaptchaExpired}
            />
            {errors.captchaToken && (
              <span className={styles.errorCaptcha}>
                {errors.captchaToken.message}
              </span>
            )}

            <div className={styles.cardAction}>
              <input
                type="submit"
                name="submit"
                className={styles.btnResetPassword}
                value={t('auth.resetForm.buttonSubmit')}
                onClick={handleSubmit(onSubmitResetPassword)}
                disabled={isSubmitDisabled}
              />
              <input
                type="button"
                name="cancel"
                className={styles.btnCancel}
                value={t('auth.resetForm.buttonCancel')}
                onClick={handleCancel}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
