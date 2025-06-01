import React, { useState, useEffect } from 'react'
import { useGlobalState } from '../../useGlobalState'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { basicColor } from '../../utilita/defauit.ts'
import SearchIcon from '@mui/icons-material/Search'
import styles from './InputWithClear.module.css'

interface IInputProps {
  activePage: number,
  activeSubPage: string,
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputWithClearButton: React.FC<IInputProps> = ({ 
  activePage, 
  activeSubPage, 
  handleSearch 
}) => {
  const [itemSearch, setItemSearch] = useGlobalState('itemSearch') 
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false)
  const { t, i18n } = useTranslation()  

  // Обработчик клика по крестику
  const handleClearClick = () => {
    // Анимируем стирание текста
    const clearAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200)) 
      setItemSearch('')
      // onChange?.('')
    }
    clearAnimation()
  }

  useEffect(() => {
    setIsClearButtonVisible(itemSearch.trim() !== '')
  }, [itemSearch])

  return (
    <div className={styles.containerSearch}>
      <div className={styles.searchIcon}>              
        <SearchIcon />
      </div>      
      <motion.input
        type="text"
        className={styles.searchInput}              
        placeholder={
          (activePage === 0) ? t('catList.searchInput') : 
          (activePage === 1) ? t('postPage.searchInput') :  
          (activeSubPage !== '') ? t('singlePostPage.searchInput') :
          (activePage === 2) ? t('adminUser.searchInput') :
          t('adminLog.searchInput')
        }
        value={itemSearch}
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
        >
          ✕ {/* Крестик */}
        </motion.button>
      )}
      </AnimatePresence>
    </div>
  )
}