import React, { useState, useEffect, useContext, useRef } from 'react'
import { useGlobalState } from '../../useGlobalState'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SearchContext } from '../../context/SearchContext.ts'
import search_icon from '../../assets/static/search.svg'
import styles from './InputWithClear.module.css'

interface IInputProps {
  activePage: number
  activeSubPage: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

type SearchType = 'all' | 'posts' | 'comments'

interface SearchTypeOption {
  value: SearchType
  // label: string
  icon: React.ReactNode
  description: string
}

export const InputWithClearButton: React.FC<IInputProps> = ({
  activePage,
  handleSearch,
}) => {
  const options: SearchTypeOption[] = [
    {
      value: 'all',
      // label: 'Везде',
      icon: '🔍',
      description: 'Искать во всех разделах',
    },
    {
      value: 'posts',
      // label: 'Посты',
      icon: '📝',
      description: 'Только в заголовках постов',
    },
    {
      value: 'comments',
      // label: 'Комм-и',
      icon: '💬',
      description: 'Только в тексте комментариев',
    },
  ]
  const [isAdmin] = useGlobalState('isAdmin')
  const [visibleList, setVisibleList] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const search = useContext(SearchContext)
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false)
  const { t } = useTranslation()

  // Обработчик клика по крестику
  const handleClearClick = () => {
    // Анимируем стирание текста
    const clearAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      search.setQuery('')
    }
    clearAnimation()
  }

  const onChange = (val: 'all' | 'posts' | 'comments') => {
    // | 'categories'
    search.setType(val)
    search.setQuery('')
    listClose()
  }

  const listTrigger = () => {
    if (!visibleList) {
      if (triggerRef.current) {
        // Используем requestAnimationFrame для оптимизации
        requestAnimationFrame(() => {
          const rect = triggerRef.current!.getBoundingClientRect()
          // const delta = isOpenHamburger ? 115 : 50
          setPosition({
            top: rect.bottom + 12, //+ window.scrollY,
            left: rect.left + window.scrollX - 10,
          })
        })
      }
    }
    setVisibleList(!visibleList)
  }

  const listClose = () => {
    setVisibleList(false)
  }

  // activePage === 0
  //   ? t('catList.searchInput')
  //   : activePage === 1
  //     ? t('postPage.searchInput')
  //     : activeSubPage !== ''
  //       ? t('singlePostPage.searchInput')
  //       : activePage === 2
  //         ? t('adminUser.searchInput')
  //         : t('adminLog.searchInput')

  const placeHolder = () => {
    if (isAdmin) {
      if (activePage === 0) return t('catList.searchInput')
      else if (activePage === 1) return t('postPage.searchInput')
      else if (activePage === 3) return t('adminLog.searchInput')
      else if (activePage === 4) return t('adminUser.searchInput')
    } else {
      if (activePage === 0 || activePage === 1) return t('postPage.searchInput')
    }
  }

  useEffect(() => {
    setIsClearButtonVisible(search.query.trim() !== '')
  }, [search.query])

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
    <div className={styles.searchWrapper}>
      <div className={styles.containerSearch}>
        <div className={styles.searchIcon}>
          <img
            src={search_icon}
            width={22}
            height={22}
            alt="icon-search"
            loading="lazy"
          />
        </div>
        <motion.input
          type="text"
          className={styles.searchInput}
          placeholder={placeHolder()}
          value={search.query}
          onChange={handleSearch}
          transition={{ duration: 0.2 }}
        />
        {/* Крестик */}
        <AnimatePresence>
          {isClearButtonVisible && (
            <motion.button
              className={styles.clearButton}
              onClick={handleClearClick}
              initial={{ opacity: 0, rotate: 0, x: -50 }}
              animate={{ opacity: 1, rotate: 90, x: 0 }}
              exit={{ opacity: 0, rotate: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{ willChange: 'transform, opacity' }}
            >
              ✕ {/* Крестик */}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {!isAdmin && (
        <div className={styles.search_type_selector} ref={triggerRef}>
          <div className={styles.options_grid}>
            {/* Показываем только активную кнопку */}
            {options
              .filter((option) => search.type === option.value) // value === option.value
              .map((option) => (
                <button
                  key={option.value}
                  className={styles.option_button}
                  onClick={listTrigger}
                  title={option.description}
                >
                  <span className={styles.option_icon}>{option.icon}</span>
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
                  willChange: 'transform, opacity',
                }}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    className={styles.option_button}
                    onClick={() => onChange(option.value)}
                    title={option.description}
                  >
                    <span
                      className={styles.option_icon}
                      style={{ fontSize: '20px' }}
                    >
                      {option.icon}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
