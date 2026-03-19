import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
  useMemo,
} from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHandleConfirm } from './useHandleConfirm.hook.ts'
import { useConfirmByToken } from './useConfirmByToken.hook.ts'
import { useGetInformConfirmEmail } from './useGetInformConfirmEmail.hook.ts'
import { EmailStatusIndicator } from './EmailStatusIndicator/EmailStatusIndicator.tsx'
import { useUserRegister } from './useUserRegister.hook.ts'
import { useUserLogin } from './useUserLogin.hook.ts'
import { useCheckingKeyboard } from './useCheckingKeyboard.hook.ts'
import { useForgetPassword } from './useForgetPassword.ts'
import { getRealUser } from './getRealUser.ts'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCheckEmailAvailability } from './useCheckEmailAvailability.ts'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { basicColor } from '../../utilita/default.ts'
import visibilityIcon from '../../assets/static/eye-light.svg'
import visibilityOffIcon from '../../assets/static/eye-slash.svg'
import close from '../../assets/static/close_big.svg'
import ReCAPTCHA from 'react-google-recaptcha'
import styles from './AuthPage.module.css'

interface Inputs {
  email: string
  password: string
  captchaToken: string
}
type Mode = 'login' | 'register'

// const headers = {
//   'Content-Type': 'multipart/form-data',
// } as RawAxiosRequestHeaders

export const AuthPage: React.FC = () => {
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false)
  const [checkedEmail, setCheckedEmail] = useState('') // ← какой email проверяли
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Режим формы: 'login' , 'register'
  const [mode, setMode] = useState<Mode>('login')
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
  >('idle')

  const [visibility, setVisibility] = useState(false)
  const auth = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  const { token } = useParams()
  const isConfirmEmail = location.pathname.includes('/confirm-email/')
  const confirmToken = isConfirmEmail ? token : null

  const inputRef = useRef<HTMLInputElement>(null)
  const hasConfirmedRef = useRef(false)
  const noUserConfirmTimerRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  const [isRealUser, setIsRealUser] = useState(false)

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const catchErrorsWithReturn = (error: unknown, name: string) => {
    if (axios.isAxiosError(error)) {
      console.log(name + ':', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message,
      })

      const errorMessage = error.response?.data?.message || 'Unknown error'
      myToast(errorMessage, basicColor.red)
      return { success: false, message: errorMessage }
    } else {
      const errorMessage =
        error instanceof Error
          ? `Global error: ${error.message}`
          : `Global error: ${String(error)}`
      myToast(errorMessage, basicColor.red)
      return { success: false, message: errorMessage }
    }
  }

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

  const { getInformConfirmEmail } = useGetInformConfirmEmail({
    myToast,
    catchErrors,
    checkedEmail,
    setIsEmailConfirmed,
    setCheckedEmail,
    noUserConfirmTimerRef,
    setIsRealUser,
  })

  const { handleConfirm } = useHandleConfirm({
    myToast,
    catchErrors,
  })

  const { userRegister } = useUserRegister({
    setEmailStatus,
    myToast,
    catchErrorsWithReturn,
    recaptchaRef,
  })

  const { userForgetPassword } = useForgetPassword({
    myToast,
    catchErrorsWithReturn,
  })

  const getFormSchema = (t: TFunction) =>
    z.object({
      email: z.string().email({ message: t('zod.messageEmailUncorrect') }), // 'Некорректный email'
      password: z
        .string()
        .min(1, t('zod.messagePasswordRequired'))
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

  const formSchema = useMemo(() => getFormSchema(t), [i18n.language])

  const methods = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      captchaToken: '',
    },
  })

  // const {
  //   register,
  //   handleSubmit,
  //   clearErrors,
  //   getValues,
  //   setValue,
  //   watch,
  //   formState: { errors, isSubmitting },
  // } = useForm<Inputs>({
  //   resolver: zodResolver(formSchema),
  //   mode: 'onChange',
  // defaultValues: {
  //   email: '',
  //   password: '',
  //   captchaToken: '',
  // },
  // })

  const {
    register,
    handleSubmit,
    clearErrors,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = methods

  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

  const { confirmByToken } = useConfirmByToken({
    myToast,
    catchErrors,
    setIsEmailConfirmed,
    token,
    setValue,
  })

  const { checkEmailAvailability } = useCheckEmailAvailability()

  const { userLogin } = useUserLogin({
    setEmailStatus,
    myToast,
    catchErrors,
    setValue,
    auth,
    recaptchaRef,
  })

  const { checkingKeyboardEmail, checkingKeyboardPassword } =
    useCheckingKeyboard({
      myToast,
      setValue,
      timerRef,
    })

  const handleForgetPassword = async () => {
    if (watchedEmail) {
      const result = await getRealUser(watchedEmail)
      if (result) await userForgetPassword(watchedEmail)
      else myToast(t('auth.form.messageNotRealUser'), basicColor.orange) // если user не зарегистрирован
    } else myToast(t('auth.form.messageFillEmailField'), basicColor.orange)
  }

  const handleClear = () => {
    setValue('email', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('password', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const hendleVisibilityOff = () => {
    setVisibility(false)
  }

  const hendleVisibility = () => {
    setVisibility(true)
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

  const onSubmitAuth: SubmitHandler<Inputs> = async (authForm: Inputs) => {
    if (mode === 'login') await userLogin(authForm)
    else await userRegister(authForm)
  }

  // const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i>
  // const pattern2 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]</>{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/</>
  const RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

  // Отслеживаем изменения валидного email
  useEffect(() => {
    const currentEmail = watchedEmail.trim()

    // ✅ Проверяем только если email валидный и изменился
    if (
      currentEmail &&
      emailStatus === 'idle' &&
      mode === 'login' &&
      currentEmail !== checkedEmail
    ) {
      // Debounce
      const timer = setTimeout(() => {
        getInformConfirmEmail(currentEmail)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      // ✅ Сбрасываем статус только если email стал пустым/невалидным
      // и предыдущий checkedEmail не пустой
      if (checkedEmail !== '') {
        setCheckedEmail('')
        setIsEmailConfirmed(false)
      }
    }
  }, [watchedEmail])

  // Дебаунс для проверки email
  useEffect(() => {
    if (mode !== 'register') {
      setEmailStatus('idle')
      return
    }

    if (errors.email || watchedEmail === '') {
      setEmailStatus('invalid')
      return
    }
    const checkTimeout = setTimeout(async () => {
      setEmailStatus('checking')
      try {
        const result = await checkEmailAvailability(watchedEmail)
        // Разные статусы в зависимости от ответа сервера
        switch (result!.status) {
          case 'available':
            setEmailStatus('available')
            break
          case 'taken':
            setEmailStatus('taken')
            break
          case 'invalid':
            setEmailStatus('invalid')
            break
          case 'error':
          default:
            setEmailStatus('idle') // Скрываем при ошибке сервера
        }
      } catch (error) {
        setEmailStatus('idle') // При ошибке скрываем сообщение
      }
    }, 800)

    return () => clearTimeout(checkTimeout)
  }, [watchedEmail, mode, errors.email])

  useEffect(() => {
    const confirmEmail = async () => {
      if (confirmToken && !hasConfirmedRef.current) {
        hasConfirmedRef.current = true
        try {
          await confirmByToken()
        } catch (error) {
          console.log('Email confirmation failed:', error)
          t('auth.toast.error')
        }
      }
    }

    confirmEmail()
  }, [confirmToken])

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      // Очищаем ошибки после первого рендера
      const timer = setTimeout(() => {
        clearErrors()
      }, 100)
      return () => clearTimeout(timer)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (noUserConfirmTimerRef.current) {
        clearTimeout(noUserConfirmTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // 1. Очищаем старые ошибки (но не сбрасываем поля!)
    clearErrors()

    // 2. Перезапускаем валидацию со старыми значениями
    // Форма сама пересчитает ошибки с новыми сообщениями
    trigger()
  }, [i18n.language, clearErrors, trigger])

  const setRefs = useCallback(
    (element: HTMLInputElement | null) => {
      // Для react-hook-form
      const { ref } = register('email')
      ref(element)

      // Для input ref
      if (inputRef) {
        ;(inputRef as MutableRefObject<HTMLInputElement | null>).current =
          element
      }
    },
    [register],
  )
  // или это
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     // После отображения формы устанавливаем фокус на email input
  //     if (inputRef.current) {
  //       inputRef.current.focus()
  //       // inputRef.current.dispatchEvent(new Event("input", { bubbles: true }))
  //       // setFocus("email")
  //     }
  //   }, 200)

  //   return () => clearTimeout(timeout)
  // }, [])

  // или requestAnimationFrame для синхронизации с браузером
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (inputRef.current) inputRef.current.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // Добавляем проверку на заполненность полей
  const isFormEmpty = !watchedEmail.trim() || !watchedPassword.trim()

  const isSubmitDisabled =
    // каптча
    !captchaValue ||
    // 0. isSubmitting
    isSubmitting ||
    // 1. Пустые поля
    isFormEmpty ||
    // 2. Ошибки валидации
    !!(errors.password?.message || errors.email?.message) ||
    // 3. Проблемы с email (только для регистрации)
    (mode === 'register' &&
      (emailStatus === 'taken' ||
        emailStatus === 'invalid' ||
        emailStatus === 'checking'))

  return (
    <div className={styles.row}>
      <div className={styles.col}>
        <h1>{t('auth.form.title')}</h1>
        <div
          className={styles.emailCofirmed}
          style={{
            opacity: mode === 'login' ? 1 : 0.4,
            color: isEmailConfirmed ? 'green' : 'orange',
          }}
        >
          {isEmailConfirmed ? (
            <p>✅ {t('auth.form.emailConfirmed')}</p>
          ) : checkedEmail !== '' ? (
            <p>⏳ {t('auth.form.emailNotConfirmed')}</p>
          ) : (
            <p>📧 {t('auth.form.emailVerification')}</p>
          )}
        </div>
        <motion.form
          className={styles.authForm}
          initial={{ opacity: 0, x: '-100px' }}
          animate={{ opacity: 1, x: '0px' }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.cardBlue}>
            <div className={styles.modeChoice}>
              <button
                className={`${styles.buttonMode} ${mode === 'login' ? styles.activeMode : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  hasConfirmedRef.current = false
                  setMode('login')
                }}
              >
                {t('auth.form.login')}
              </button>
              <button
                className={`${styles.buttonMode} ${mode === 'register' ? styles.activeMode : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  setCheckedEmail('')
                  setIsEmailConfirmed(false)
                  setValue('email', '')
                  setValue('password', '')
                  setMode('register')
                }}
              >
                {t('auth.form.regin')}
              </button>
            </div>
            <div className="cardContent white-text">
              <div className={styles.collectionInput}>
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
                      ref={setRefs}
                      id="userEmail"
                      type="text"
                      name="email"
                      onChange={checkingKeyboardEmail}
                      className={styles.yellowInput}
                      placeholder={t('auth.form.placeholderEmail')}
                      autoComplete="email"
                    />
                    <AnimatePresence>
                      {!errors.email! &&
                        !hasConfirmedRef.current &&
                        !isEmailConfirmed &&
                        isRealUser &&
                        watchedEmail &&
                        mode === 'login' && (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex' }}
                          >
                            <button
                              onClick={(event) =>
                                handleConfirm(event, getValues('email'))
                              }
                              className={styles.emailVefify}
                            >
                              {t('auth.form.confirm')}
                            </button>
                          </motion.div>
                        )}
                    </AnimatePresence>
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
                  {errors.email && mode === 'login' && (
                    <span role="alert" className={styles.auth_error}>
                      {errors.email?.message}
                    </span>
                  )}
                  {/* Показываем статус ТОЛЬКО в режиме регистрации */}
                  {mode === 'register' && (
                    <EmailStatusIndicator status={emailStatus} />
                  )}
                </div>
                <div className={styles.inputField}>
                  <label
                    className={styles.labelPasswordInput}
                    htmlFor="password"
                  >
                    {t('auth.form.fieldPassword')}
                  </label>
                  <div style={{ display: 'flex' }}>
                    <input
                      {...register('password', {
                        required: t('auth.form.messagePasswordRequired'),
                      })}
                      name="password"
                      id="inputPassword"
                      onChange={checkingKeyboardPassword}
                      type={visibility ? 'text' : 'password'}
                      className={styles.yellowInput}
                      placeholder={t('auth.form.placeholderPassword')}
                      autoComplete="password"
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
                  {errors.password && (
                    <span role="alert" className={styles.auth_error}>
                      {errors.password?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.forget}>
              <div
                className={styles.forgetPassword}
                onClick={handleForgetPassword}
              >
                {t('auth.form.forgetPassword')}
              </div>
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
                className={
                  mode === 'register' ? styles.btnGray : styles.btnYellow
                }
                value={
                  mode === 'register'
                    ? t('auth.form.registr')
                    : t('auth.form.enter')
                }
                onClick={handleSubmit(onSubmitAuth)}
                disabled={isSubmitDisabled}
              />
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
