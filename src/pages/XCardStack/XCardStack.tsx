import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from "framer-motion"
import image1 from '../../assets/Blueberry.png'
import image2 from '../../assets/Fig.png'
import image3 from '../../assets/Lime.png'
import image4 from '../../assets/Mango.png'
import styles from './XCardStack.module.css'

export const XCardStack: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const [xScreen , setXScreen ] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollY } = useScroll({ container: containerRef }) // Отслеживаем положение скролла 
   
  // const scrollY = useMotionValue(0)
  // console.log('useScroll=', scrollY)
  
  const cards = [
    { title: 'Card 1', text: 'Это первая карточка. Это первая карточка. Это первая карточка. Это первая карточка. Это первая карточка.', image: image1 },
    { title: 'Card 2', text: 'Это вторая карточка. Это вторая карточка. Это вторая карточка.', image: image2 },
    { title: 'Card 3', text: 'Это третья карточка. Это третья карточка. Это третья карточка. Это третья карточка. Это третья карточка. Это третья карточка.', image: image3 },
    { title: 'Card 4', text: 'Это четвертая карточка. Это четвертая карточка', image: image4 },
  ] 

  const functionIsActive = (element: HTMLDivElement) => {
   
    if (element) {
      const topPosition = element.offsetTop // Относительная позиция по вертикали 
      console.log('Относительная топ позиция:', topPosition) 

      // Абсолютная позиция относительно документа
      let absoluteTop = topPosition 

      let parent = element.offsetParent as HTMLElement | null
      while (parent) {
        absoluteTop += parent.offsetTop    
        parent = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null
      }

      console.log('Абсолютная топ позиция:', absoluteTop) 
      console.log('Высота элемента:', element.offsetHeight)     
      // const isActive = currentScrollY >= el.offsetTop && currentScrollY < el.offsetTop + el.offsetHeight;
      if (window.scrollY >= (absoluteTop - 500) && window.scrollY < (absoluteTop - 500 + element.offsetHeight)) {
        return true
      } else return false
    } 
  } 

  const positionElement = (element: HTMLDivElement) => {
   
    if (element) {
      const topPosition = element.offsetTop // Относительная позиция по вертикали 
      console.log('Относительная топ позиция:', topPosition) 

      // Абсолютная позиция относительно документа
      let absoluteTop = topPosition 

      let parent = element.offsetParent as HTMLElement | null
      while (parent) {
        absoluteTop += parent.offsetTop    
        parent = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null
      }
      const start = absoluteTop - 500
      const end = start + element.offsetHeight

      console.log('Абсолютная топ позиция:', absoluteTop) 
      console.log('Высота элемента:', element.offsetHeight)     
     
      return { start, end }
    } 
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    let innerWidth = Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    )
    setXScreen(innerWidth)
    // setXScreen(window.innerWidth)
    
    const handleScroll = () => {
      scrollY.set(window.scrollY)

      const currentScrollY = window.scrollY      
      // Определяем направление скролла
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }

      lastScrollY = currentScrollY

      // Находим индекс активной карточки
      const activeElement = cardRefs.current.findIndex((el, index) => {
        if (!el) return false
       
        console.log('currentScrollY=', currentScrollY)       
        const isActive = functionIsActive(el)        

        return isActive  
      })
      console.log('activeElement=', activeElement)    
      // Если движемся вниз и активных элементов нет, используем lastActiveIndex
      if (scrollDirection === 'down' && activeElement === -1 && lastActiveIndex !== null) {
        setActiveIndex(lastActiveIndex)
      }

      // Если движемся вверх и активных элементов нет, устанавливаем null
      if (scrollDirection === 'up' && activeElement === -1) {
        setActiveIndex(null)
      }
      // -----
      if (activeElement !== -1 && scrollDirection === 'down') {
        setLastActiveIndex(activeElement)
        setActiveIndex(activeElement)     
       } 
      //  else if (activeElement === -1 && scrollDirection === 'up') {
      //   setLastActiveIndex(activeElement)
      //   setActiveIndex(null)
      // }   
    }    

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [xScreen])   

  return (
    <div className={styles.cardContainer}>
      <h2>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta
      adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta
      sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi nemo aliquam.
      </h2>
      
      <div className={styles.cards}>
        <div>
          <h3>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet 
            sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit ametconsectetur, adipisicing elit. Quam quia aliquid beatae quasi asperiores, voluptate inventore non nemo aliquam.            
          </h3>
        </div>
        <div className={styles.cardsSliding} ref={containerRef}>
          {cards.map((card, index) => {

          const elRef = useRef<HTMLDivElement>(null)
          cardRefs.current[index] = elRef.current 

          // Рассчитываем translateX для каждой карточки
          const translateX = useTransform(
            scrollY, 
            [positionElement(elRef.current!)?.start!, positionElement(elRef.current!)?.end!], 
            [xScreen, 0]
          )
          console.log('xScreen:', xScreen)           
          console.log('translateX=', translateX.get())            
         
          return (

          <motion.div
            key={index}
            //ref={(el) => (cardRefs.current[index] = el)} // Сохраняем реф для каждой карточки
            ref={elRef}
            className={styles.cardSliding + `${(index === activeIndex) ? ' '+ styles.active : ''}`}  
          >
            <motion.div              
              className={styles.cardBg}               
              // animate={{              
              //   transform: (index % 2 === 0) ?  
              //   (index === activeIndex) ? `translateX(${translateX.get()}px)` :
              //   (index < activeIndex!) ? 'translateX(0px)' : 'translateX(100%)':                
              //   (index === activeIndex) ? `translateX(${-translateX.get()}px)` :
              //   (index < activeIndex!) ? 'translateX(0px)' : 'translateX(-100%)',               
              //   transition: {duration: 0.01}
              // }}
              style={{
                transform: (index % 2 === 0) ?  
                  (index === activeIndex) ? `translateX(${translateX.get()}px) translateZ(0px)` :
                  (index < activeIndex!) ? 'translateX(0px) translateZ(0px)' : 'translateX(105%) translateZ(0px)':                
                  (index === activeIndex) ? `translateX(${-translateX.get()}px) translateZ(0px)` :
                  (index < activeIndex!) ? 'translateX(0px) translateZ(0px)' : 'translateX(-105%) translateZ(0px)'
              }}
              // style={{
              //   transform: `translateX(${(index % 2 === 0)
              //   ? (index === activeIndex ? translateX.get() : index < activeIndex! ? '0%' : '100%')
              //   : (index === activeIndex ? -translateX.get() : index < activeIndex! ? '0%' : '-100%')}`
              // }}
              animate={{ transition: {duration: 0.01} }}
            >
            </motion.div>
            <div 
              className={styles.cardSlider}
              // animate={{transition: {duration: 0.01}}}
              // style={{width: (index % 2 === 0) ? '100vw' : `${(xScreen + translateX.get() - 40)}px`, zIndex: (index % 2 === 0) ? 1 : 2 }}
              style={{width: (index % 2 === 0) ? '100vw' : `${(xScreen - translateX.get() - 101)}px`, zIndex: (index % 2 === 0) ? 1 : 2}}
            >
              <div className={styles.cardTextArea}>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2>{card.title}</h2>
                    <p>{card.text}</p>
                  </div>
                  <div className={styles.cardImage}>
                    <img src={card.image} alt="" style={{color: 'transparent'}} />
                  </div>
                </div> 
              </div>
            </div> 
            <div 
              className={styles.cardSlider + ` ${styles.cardSliderInverse}`}
              // animate={{transition: {duration: 0.01}}}
              // style={{width: (index % 2 === 0) ? `${(translateX.get() + 40)}px` : '100%',
              //   zIndex: (index % 2 === 0) ? 2 : 1                
              // }}
              style={{width: (index % 2 === 0) ? `${(translateX.get() + 40)}px` : '100%',
               zIndex: (index % 2 === 0) ? 2 : 1
            }}
            >
              <noindex>
              <div className={styles.cardTextArea}>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2>{card.title}</h2>
                    <p>{card.text}</p>
                  </div>
                  <div className={styles.cardImage}>
                    <img src={card.image} alt="" style={{color: 'transparent'}} />
                  </div>
                </div> 
              </div>
              </noindex>           
            </div> 
          </motion.div>
          )
          })}
        </div>
      </div>
      <h3>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur,
      asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi  adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      </h3>    
    </div>
  )
}

// animate={{              
//   transform: (index % 2 === 0) ? 
//   (index === activeIndex) ? `translateX(${translateX.get()}px)` :
//   (index < activeIndex!) ?        
//   'translateX(0px)' : 'translateX(-100%)':
//   // 'translateX(0px)' : 'translateX(100%)':
//   (index === activeIndex) ? `translateX(${-translateX.get()}px)` :
//   (index < activeIndex!) ?        
//   'translateX(0px)' : 'translateX(-100%)',
//   // 'translateX(0px)' : 'translateX(-100%)',
//   transition: {duration: 0.01}
// }}