import React from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import styles from './MenuItem.module.css'

interface IMenuItemProps {
  item: React.ReactNode,
  index: number,
  activePage: number,
  widthActiveLine: number,  
  isVertical?: boolean,
  getKey: string,
  width: number|undefined
}

export const MenuItem: React.FC<IMenuItemProps> = ({
  item,
  index,
  activePage,
  widthActiveLine,  
  isVertical = false,
  getKey,
  width
}) => {

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      color: activePage === index ? 'rgb(255, 0, 0)' : '#fff',
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      color: 'rgb(255, 255, 255)',   
      transition: { duration: 0.2, when: "afterChildren" }      
    }
  }

  return (
    // <AnimatePresence>
    <motion.div
      key={getKey}
      className={
        activePage === index
          ? `${isVertical ? styles.mainMenuVert : styles.mainMenu} activeLine`
          : isVertical
          ? styles.mainMenuVert
          : styles.mainMenu
      }
      style={{
        margin: width! < 850 ? '0 0.1rem' : '0 0.5rem',
        textAlign: 'center',
        position: 'relative',
        fontWeight: activePage === index ? 600 : 400,
      }}
      // initial={{ color: 'rgb(255, 255, 255)' }}
      // animate={{ color: activePage === index ? 'rgb(255, 0, 0)' : '#fff' }}
      // transition={{ duration: 0.25 }}
      // initial="closed"
      // animate={isOpenHamburger ? "open" : "closed"}
      // exit="closed"
      variants={itemVariants}     
    >
      {activePage === index && (
        <motion.div
          layoutId="activeItem"
          style={{
            width: `calc(100% - ${widthActiveLine}px)`,
            height: '2px',
            position: 'absolute',
            bottom: '0px',
            left: `${widthActiveLine / 2}px`,
            backgroundColor: 'red',
          }}
        />
      )}
      {item}
    </motion.div>
    // </AnimatePresence>
  )
}