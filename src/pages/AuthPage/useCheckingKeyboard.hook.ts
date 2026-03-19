import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormSetValue } from 'react-hook-form'
import { basicColor } from '../../utilita/default.ts'

interface Inputs {
  email: string
  password: string
  captchaToken: string
}

interface UseCheckingKeyboardProps {
  myToast: (message: string, backgroundColor: string) => void
  setValue: UseFormSetValue<Inputs>
  timerRef: React.MutableRefObject<NodeJS.Timeout | undefined>
}
// проверка символов
export const useCheckingKeyboard = ({
  myToast,
  setValue,
  timerRef,
}: UseCheckingKeyboardProps) => {
  const { t } = useTranslation()

  const checkingKeyboardEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataInput = event.target.value
    setValue('password', '', {
      shouldValidate: true,
      shouldDirty: true,
    })

    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // СРАЗУ проверяем на недопустимые символы
    const hasInvalidChars = /[^a-zA-Z0-9._%+-@]/.test(dataInput)
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

  const checkingKeyboardPassword = (
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
      setValue('password', filteredValue, {
        shouldValidate: true,
        shouldDirty: true,
      })
      console.log('getValues(password)', dataInput)
    }
  }
  return { checkingKeyboardEmail, checkingKeyboardPassword }
}
