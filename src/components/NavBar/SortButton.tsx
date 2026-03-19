import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SortContext } from '../../context/SortContext.ts'
import campfire_white from '../../assets/static/campfire-white.svg'
import campfire from '../../assets/static/campfire.svg'
import calendar_3day from '../../assets/static/calendar-3day.svg'
import calendar_3day_white from '../../assets/static/calendar-3day-white.svg'
import calendar_all_time from '../../assets/static/calendar-all-time.svg'
import calendar_all_time_white from '../../assets/static/calendar-all-time-white.svg'
import calendar_month from '../../assets/static/calendar-month.svg'
import calendar_month_white from '../../assets/static/calendar-month-white.svg'
import calendar_year from '../../assets/static/calendar-year.svg'
import calendar_year_white from '../../assets/static/calendar-year-white.svg'
import styles from './SortButton.module.css'

type SortType = 'fresh' | 'popular' | 'month' | 'year' | 'all'

interface SortTypeOption {
  value: SortType
  // label: string
  icon: string
  icon_white: string
  description: string
}

export const SortButton: React.FC = () => {
  const { t } = useTranslation()

  const options: SortTypeOption[] = [
    {
      value: 'popular',
      // label: 'Посты',
      icon: campfire,
      icon_white: campfire_white,
      description: t('navBar.sortButton.popular'),
    },
    {
      value: 'fresh',
      // label: 'Комм-и',
      icon: calendar_3day,
      icon_white: calendar_3day_white,
      description: t('navBar.sortButton.fresh'),
    },
    {
      value: 'month',
      // label: 'Комм-и',
      icon: calendar_month,
      icon_white: calendar_month_white,
      description: t('navBar.sortButton.month'),
    },
    {
      value: 'year',
      // label: 'Комм-и',
      icon: calendar_year,
      icon_white: calendar_year_white,
      description: t('navBar.sortButton.year'),
    },
    {
      value: 'all',
      // label: 'Везде',
      icon: calendar_all_time,
      icon_white: calendar_all_time_white,
      description: t('navBar.sortButton.all'),
    },
  ]

  const [visibleList, setVisibleList] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const sortType = useContext(SortContext)
  // const [searchType, setSearchType] = useState<'all' | 'posts' | 'comments'>(
  //   'all'
  // )
  // const [isClearButtonVisible, setIsClearButtonVisible] = useState(false)

  const onChange = async (
    val: 'fresh' | 'popular' | 'month' | 'year' | 'all',
  ) => {
    await Promise.resolve()
    sortType.setSortType(val)
    listClose()
  }

  // const listTrigger = () => {
  //   if (!visibleList) {
  //     if (triggerRef.current) {
  //       const rect = triggerRef.current.getBoundingClientRect()

  //       console.log('DEBUG координаты:', {
  //         rectLeft: rect.left,
  //         scrollX: window.scrollX,
  //         computedLeft: rect.left + window.scrollX,
  //         parentOffsetLeft: triggerRef.current.parentElement?.offsetLeft,
  //         parentClientLeft:
  //           triggerRef.current.parentElement?.getBoundingClientRect().left,
  //       })

  //       setPosition({
  //         top: rect.bottom + 12, //+ window.scrollY,
  //         left: rect.left + window.scrollX - 5,
  //       })
  //       // console.log('rect.bottom=', rect.bottom)
  //       // console.log('rect.left=', rect.left)
  //     }
  //   }
  //   setVisibleList(!visibleList)
  // }

  const listTrigger = () => {
    if (!visibleList) {
      if (triggerRef.current) {
        // Находим родителя с position: relative
        const parentWithRelative = triggerRef.current.closest(
          `.${styles.sort_type_selector}`,
        )

        if (parentWithRelative) {
          // const buttonRect = triggerRef.current.getBoundingClientRect()
          // const parentRect = parentWithRelative.getBoundingClientRect()

          // offsetTop/offsetLeft не вызывают reflow!
          const relativeTop =
            triggerRef.current.offsetTop + triggerRef.current.offsetHeight
          const relativeLeft = triggerRef.current.offsetLeft

          // Вычисляем координаты ОТНОСИТЕЛЬНО родителя
          // const relativeTop = buttonRect.bottom - parentRect.top
          // const relativeLeft = buttonRect.left - parentRect.left

          // console.log('Относительные координаты:', {
          //   buttonBottom: buttonRect.bottom,
          //   parentTop: parentRect.top,
          //   relativeTop,
          //   buttonLeft: buttonRect.left,
          //   parentLeft: parentRect.left,
          //   relativeLeft,
          // })

          setPosition({
            top: relativeTop + 13, // Относительно верха родителя
            left: relativeLeft - 6, // Относительно левого края родителя
          })
        }
      }
    }
    setVisibleList(!visibleList)
  }

  const listClose = () => {
    setVisibleList(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Закрываем если клик был ВНЕ нашего компонента
      const target = event.target as HTMLElement

      // Проверяем, кликнули ли мы по активной кнопке
      const isActiveButton = target.closest(`.${styles.option_button}`)

      if (
        triggerRef.current && // ref существует
        !triggerRef.current.contains(target) && // клик ВНЕ компонента
        !isActiveButton // ← Не закрываем если клик по активной кнопке
      ) {
        setVisibleList(false)
      }
    }

    // Добавляем слушатель только когда список открыт
    if (visibleList) {
      document.addEventListener('mousedown', handleClickOutside)

      // Также закрываем по Escape
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setVisibleList(false)
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [visibleList])

  return (
    <div className={styles.containerSort}>
      <div className={styles.sort_type_selector}>
        <div className={styles.options_grid} ref={triggerRef}>
          {/* Показываем только активную кнопку */}
          {options
            .filter((option) => sortType.sortType === option.value) // value === option.value
            .map((option) => (
              <button
                key={option.value}
                className={styles.option_button_p}
                onClick={listTrigger}
                title={option.description}
              >
                {/* <span className={styles.option_icon}>{option.icon}</span> */}
                <img
                  className={styles.option_icon}
                  src={option.icon_white}
                  width={28}
                  height={28}
                  alt={option.value}
                  loading="lazy"
                />
              </button>
            ))}
        </div>
        <AnimatePresence>
          {visibleList && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={styles.visibleList}
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  className={styles.option_button}
                  onClick={() => onChange(option.value)}
                  title={option.description}
                >
                  {/* <span className={styles.option_icon}>{option.icon}</span> */}
                  <img
                    className={styles.option_icon}
                    src={option.icon}
                    width={28}
                    height={28}
                    alt={option.value}
                    loading="lazy"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
