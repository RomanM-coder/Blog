import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormSetValue } from 'react-hook-form'
import { basicColor } from '../../../utilita/default.ts'

interface Inputs {
  token: string | undefined
  email: string
  newPassword: string
  confirmNewPassword: string
  captchaToken: string
}

interface UseResetCheckingKeyboardProps {
  myToast: (message: string, backgroundColor: string) => void
  setValue: UseFormSetValue<Inputs>
  timerRef: React.MutableRefObject<NodeJS.Timeout | undefined>
}
// проверка символов в форме ResetPasswordForm
export const useResetCheckingKeyboard = ({
  myToast,
  setValue,
  timerRef,
}: UseResetCheckingKeyboardProps) => {
  const { t } = useTranslation()

  const checkingKeyboardEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataInput = event.target.value

    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // СРАЗУ проверяем на недопустимые символы
    const hasInvalidChars =
      // i18n.language === 'en'
      //   ?
      /[^a-zA-Z0-9._%+-@]/.test(dataInput)
    // : /[^а-яёА-ЯЁ0-9._%+-@]/.test(dataInput)
    const hasRusSimbol = /[а-яёА-ЯЁ]/.test(dataInput)

    // Фильтруем значение
    const filteredValue = dataInput.replace(/[^a-zA-Z0-9._%+-@]/g, '')
    setValue('email', filteredValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
    console.log('hasInvalidChars=', hasInvalidChars)
    console.log('hasRusSimbol=', hasRusSimbol)

    // Toast с задержкой
    if (hasInvalidChars && hasRusSimbol) {
      timerRef.current = setTimeout(() => {
        myToast(
          'Перейдите, пожалуйста, на английскую раскладку клавиатуры',
          basicColor.red,
        )
      }, 500)
    } else if (hasInvalidChars) {
      timerRef.current = setTimeout(() => {
        myToast(t('navBar.toast.keyboardSignLayout'), basicColor.red)
      }, 500)
    }
  }

  const checkingKeyboardNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataInput = event.target.value

    if (dataInput !== '') {
      // if (i18n.language === 'en' && !/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {
      if (!/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {
        myToast(t('navBar.toast.keyboardSignLayout'), basicColor.red)
      } else if (
        !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)
        //   i18n.language === 'ru' &&
        //   !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)
      ) {
        // myToast(t('navBar.toast.keyboardLayout'), basicColor.red)
      }

      const filteredValue = dataInput.replace(/[^a-zA-Z0-9._%+-@]/g, '')
      setValue('newPassword', filteredValue, {
        shouldValidate: true,
        shouldDirty: true,
      })
      console.log('getValues(password)', dataInput)
    }
  }
  const checkingKeyboardConfirmNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataInput = event.target.value

    if (dataInput !== '') {
      // if (i18n.language === 'en' && !/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {
      if (!/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {
        myToast(t('navBar.toast.keyboardSignLayout'), basicColor.red)
      } else if (
        !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)
        //   i18n.language === 'ru' &&
        //   !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)
      ) {
        // myToast(t('navBar.toast.keyboardLayout'), basicColor.red)
      }

      const filteredValue = dataInput.replace(/[^a-zA-Z0-9._%+-@]/g, '')
      setValue('confirmNewPassword', filteredValue, {
        shouldValidate: true,
        shouldDirty: true,
      })
      console.log('getValues(password)', dataInput)
    }
  }

  return {
    checkingKeyboardEmail,
    checkingKeyboardNewPassword,
    checkingKeyboardConfirmNewPassword,
  }
}
