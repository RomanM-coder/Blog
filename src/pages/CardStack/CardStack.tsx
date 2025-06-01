import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useMotionValue, useTransform, useMotionValueEvent, animate, useMotionTemplate } from "framer-motion"
import {useAnimatedCounter} from '../../components/Counter'
import styles from './CardStack.module.css'

export const CardStack: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cardRanges, setCardRanges] = useState<{ start: number, end: number }[]>([])

  const [animated, setAnimated] = useState(false)
  const number = useMotionValue(0)
  const { scrollY } = useScroll()

  const sectionRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)

  const counter = useAnimatedCounter(100, 0, 5)

  const [activeHamb, setActiveHamb] = useState(false)  
  // const scrollY = useMotionValue(0)

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   if (latest >= 2540 && !animated) {
  //     setAnimated(true);
  //     animate(number, 100, { duration: 2 });
  //   }
  // });
  // const { scrollY } = useScroll();
  // const shouldAnimate = useTransform(scrollY, [2539, 2540], [0, 1]);
  // const number = useTransform(shouldAnimate, [0, 1], [0, 100], {
  //   clamp: true
  // })
  const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
  )
  const maxNumber = 1000 // Максимальное значение числа
  // const numberValue = useMotionValue(0) // Начальное значение числа
  // const animatedNumber = useTransform(numberValue, (value) => Math.round(value))
 
  // const scrollY = useMotionValue(0)
  // const numberValue = useTransform(scrollY, [0, 500], [0, 100])
  // console.log('useMotionValue->scrollY', scrollY)
  
  const cards = [
    'Card 1',
    'Card 2',
    'Card 3',
    'Card 4',
    'Card 5',
    'Card 6',
  ] 

  // const functionIsActive = (element: HTMLDivElement) => {
   
  //   if (element) {
  //     const topPosition = element.offsetTop // Относительная позиция по вертикали 
  //     console.log('Относительная топ позиция:', topPosition) 

  //     // Абсолютная позиция относительно документа
  //     let absoluteTop = topPosition 

  //     let parent = element.offsetParent as HTMLElement | null
  //     while (parent) {
  //       absoluteTop += parent.offsetTop    
  //       parent = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null
  //     }

  //     console.log('Абсолютная топ позиция:', absoluteTop) 
  //     console.log('Высота элемента:', element.offsetHeight)
  //     console.log('window.scrollY >= (absoluteTop - 300):', window.scrollY >= (absoluteTop -300)) 
  //     console.log('window.scrollY < (absoluteTop - 300 + element.offsetHeight):', window.scrollY < (absoluteTop - 300 + element.offsetHeight))     
  //     // const isActive = currentScrollY >= el.offsetTop && currentScrollY < el.offsetTop + el.offsetHeight;
  //     if (window.scrollY >= (absoluteTop - 300) && window.scrollY < (absoluteTop - 300 
  //          + element.offsetHeight)) {
  //       return true
  //     } else return false
  //   } 
  // }
  
  const handleScrollTo = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollUp = () => {
    if (section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const positionElement = (element: HTMLDivElement): { start: number, end: number } => {
    
    if (!element) {
      return { start: 0, end: 0 }
    }
    
    const topPosition = element.offsetTop // Относительная позиция по вертикали 
    console.log('Относительная топ позиция:', topPosition) 

    // Абсолютная позиция относительно документа
    let absoluteTop = topPosition 

    let parent = element.offsetParent as HTMLElement | null
    while (parent) {
      absoluteTop += parent.offsetTop    
      parent = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null
    }
    const start = absoluteTop - 200
    const end = start + element.offsetHeight

    console.log('Абсолютная топ позиция:', absoluteTop) 
    console.log('Высота элемента:', element.offsetHeight)     
    
    return { start, end }    
  }

  useEffect(() => {
    let lastScrollY = window.scrollY      
    
    const handleScroll = () => {
      scrollY.set(window.scrollY)
      // console.log('max-scroll---------------=', Math.max(
      //   document.body.scrollHeight,
      //   document.documentElement.scrollHeight
      // ))

      const currentScrollY = window.scrollY      
      // Определяем направление скролла
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }

      lastScrollY = currentScrollY

      //Находим индекс активной карточки
      // const activeElement = cardRefs.current.findIndex((el, i) => {
      //   if (!el) return false
        
        // const viewportCenter = window.innerHeight / 2 // Центр viewport       
        
        // const rect = el.getBoundingClientRect() // Получаем размеры и позицию элемента
        // const containerRect = containerRef.current!.getBoundingClientRect()
        // console.log('rect.top=', i, rect.top)
        // console.log('rect.height=', i, rect.height)
        // console.log('currentScrollY=', currentScrollY)
        // console.log('containerRect.top=', containerRect.top)
        // console.log('viewportCenter=', viewportCenter)
        // const isActive = // Элемент активен, если его центр находится близко к центру viewport
        //   rect.top + containerRect.top  >= viewportCenter - 100 &&
        //   rect.top + containerRect.top  <= viewportCenter + 100 
        //const isActive = functionIsActive(el)

        //return isActive           
      // })

      // Находим активный элемент
      const activeElement = cards.findIndex((el, i) => { 
        if (!el) return false      
        const startScroll = i * 400 - 400
        let endScroll = startScroll + 400
        if (i === 5) endScroll = startScroll + 1000

        return currentScrollY >= startScroll && currentScrollY < endScroll       
      })
      console.log('activeElement=', activeElement)    
      
      setActiveIndex(activeElement !== -1 ? activeElement : null)
    }

    window.addEventListener('scroll', handleScroll)
    // const timeoutId = setTimeout(() => {
    //   requestAnimationFrame(handleScroll)     
    // }, 300)

    return () => {
      //if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  useEffect(() => {
    const calculateRanges = () => {
      const ranges: { start: number, end: number }[] = []

      cardRefs.current.forEach((el, i) => {
        if (el) {
          const { start, end } = positionElement(el)
          ranges.push({ start, end })
        }
      })

      setCardRanges(ranges) // Сохраняем диапазоны в состоянии
    }

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(calculateRanges)     
    }, 300)
    // calculateRanges() // Вызываем при монтировании

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      setCardRanges([]) // Очищаем состояние при размонтировании
    }
  }, [])

  // useEffect(() => {
  //   let animationStarted = false // Внутренний флаг для контроля анимации
  //   const unsubscribe = scrollY.onChange((latest) => {
  //     // Если скролл достиг 2540px и анимация еще не запущена
  //     if (latest >= 2540 && !animationStarted) {
  //       animationStarted = true
       
  //       // Асинхронный запуск анимации
  //       startAnimation()
  //     }
  //   })

  //   const startAnimation = async () => {
  //     await animate(number, 100, { duration: 2 })
  //   }

  //   // Очищаем подписку при размонтировании компонента
  //   return () => unsubscribe()
  // }, [scrollY])

  return (
    <div className={styles.cardContainer}>      
      <motion.h2 ref={section2Ref}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi nemo aliquam.
      </motion.h2>
      {/* <form>
        <input 
          type="text" 
          name="username" 
          // autoComplete="username"
          autoFocus 
        />
        <input type="password" name="password" autoComplete="current-password" />
        <button type="submit">Войти</button>
      </form> */}
      {/* <button 
        className={styles.toggleHamburger + ` ${styles.toggleX}` + `${(activeHamb === false) ? ' '+ styles.active : ''}`}
        onClick={() => setActiveHamb(!activeHamb)}>
        <span>toggle menu</span>
      </button> */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleScrollTo}
        style={{
          padding: '10px 20px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'          
        }}
      >
        Перейти к секции
      </motion.button>
      <div className={styles.cards} ref={containerRef}>
        <div style={{position: 'sticky', top: '15px', marginTop: '0px', transition: 'top .3s ease-in-out'}}>
          <h3>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet 
            sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit ametconsectetur, adipisicing elit. Quam quia aliquid beatae quasi asperiores, voluptate inventore non nemo aliquam.            
          </h3>
        </div>
        {cards.map((card, index) => {

        const elRef = useRef<HTMLDivElement>(null) // Реф для каждого элемента
        cardRefs.current[index] = elRef.current // Сохраняем реф в массиве        
        const scale = useTransform(
          scrollY, 
          // [positionElement(index)[0], positionElement(index)[1]],
          // [positionElement(elRef.current!)?.start!, positionElement(elRef.current!)?.end!], 
          // [(400 + index*330), (400 + 330*(index+1))],
          [cardRanges[index]?.start!, cardRanges[index]?.end!], 
          // [1, (0.1 + (index + 3)/(index + 4))]
          [1, 0.8]
        )
        // console.log('start=', positionElement(elRef.current!)?.start!)
        // console.log('end=', positionElement(elRef.current!)?.end!)

          return (            
          <motion.div
            key={index}
            //ref={(el) => (cardRefs.current[index] = el)} // Сохраняем реф для каждой карточки
            ref={elRef}
            className={styles.cardWrapper + `${(index === activeIndex) ? ' '+ styles.active : ''}`}
            // className={styles.cardWrapper}
            animate={{transition: { duration: 0.3 }}}            
            style={{              
              //transform: (index < activeIndex!) ? `scale(${scale[index]}) translateZ(0px)` : 'scale(1)',
              //scale,
              scale: (index < activeIndex!)? scale : 1, 
              position: 'sticky',
              top: '200px',
              marginTop: (index !== 0) ? '-30px' : '0px',
              zIndex: index + 1 // Активная карточка всегда наверху
            }} 
          >
            <div className={styles.cardContent}>
              <h2>{card}</h2>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores dolor sit amet consectetur voluptatum repellendus beatae quasi asperiores, voluptate inventore.
              </p>             
            </div>
          </motion.div>
          )
        })}
      </div>
      <h3>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur,
      asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi  adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      </h3>
      <div>
        <motion.span style={{color: 'black', fontWeight: 'bold'}}>
          {counter}          
        </motion.span>
      </div>
      <div style={{position: 'relative'}}>
        <h1 style={{textAlign: 'center'}}>Целевая секция</h1>
        <motion.div
          ref={sectionRef}
          style={{ height: '100vh', backgroundColor: 'blue', textAlign: 'center', color: 'white',
            // background: `url('../src/assets/lime.png') no-repeat center center/cover`,
            filter: 'blur(10px)',
            zIndex: -1,
            position: 'relative'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >         
          <h2 style={{position: 'absolute', top: '50%', left: '0px'}}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum</h2>
          <div style={{position: 'absolute', top: '10%', left: '10%', width: '40px', height: '40px', color: 'white'}}></div>           
        </motion.div>
        {/* <div className={styles.bokehEffect}></div> */}
        <h2 className={styles.content}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor</h2>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleScrollUp}
        style={{
          padding: '10px 20px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'          
        }}
      >
        Перейти наверх
      </motion.button>
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
//   y: scrollDirection === 'down'
//     ? index > activeIndex! && activeIndex !== null
//       ? -cardHeight * (index - activeIndex! - 1)
//       : 0
//     : index < activeIndex! && activeIndex !== null
//     ? cardHeight * (activeIndex! - index + 1)
//     : 0,
//   opacity: index === activeIndex ? 1 : 0.7, // Активная карточка более яркая
//   scale: index === activeIndex ? 1.1 : 1, // Активная карточка увеличивается
//   transition: {
//     duration: 0.5,
//     delay: Math.abs(index - (activeIndex ?? 0)) * 0.1, // Задержка для плавности
//   }

// variant with framer
{/* <div className={styles.cards}>
        {cards.map((card, index) => (
          <motion.div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)} // Сохраняем реф для каждой карточки
            className={styles.cardWrapper + `${(index === activeIndex) ? ' '+styles.active : ''}`}
            // className={styles.cardWrapper}
            initial={{ y: 0 }} // Начальное состояние
            // whileInView={{ // Анимация при попадании в viewport
            //   y: index >= activeIndex!+2 ? -195 : 0,                          
            //   transition: { duration: 0.5, delay: 0.4 }
            // }}
            // animate={animate(activeIndex!, index)} 
            animate={{              
              y: scrollDirection === 'down' ?
                (activeIndex !== null)&&(activeIndex != -1)
                ? (activeIndex >= index)
                ? -index*cardHeight
                : -activeIndex*cardHeight
                : 0               
              :
                (activeIndex !== null)&&(activeIndex != -1)
                  ? (activeIndex >= index)
                  ? (activeIndex - index)*cardHeight
                  : (index - activeIndex)*cardHeight
                  : 0,
              scale: index === activeIndex ? 1.05 : 1, // Активная карточка увеличивается
              transition: {  duration: 0.5 }
            }}           
            // viewport={{ once: false, amount: 0.7 }} // Параметры IntersectionObserver
            style={{ zIndex: index + 1, scale: (index === activeIndex ) ? 1.05 : 1 }} // Активная карточка всегда наверху
          >
            <div className={styles.cardContent}>
              <h2>{card}</h2>
              <p>Это описание карточки.</p>
            </div>
          </motion.div>
        ))} */}

        // transform: scrollDirection === 'down' ?
              //   (activeIndex !== null)&&(activeIndex != -1)
              //   ? (activeIndex >= index)
              //   ? `translateY(-${index*cardHeight}px)`
              //   : `translateY(-${activeIndex!*cardHeight}px)`
              //   : 'none'               
              // :
              //   (activeIndex !== null)&&(activeIndex != -1)
              //     ? (activeIndex >= index)
              //     ? `translateY(${(activeIndex! - index)*cardHeight}px)`
              //     : `translateY(${(index - activeIndex!)*cardHeight}px)`
              //     : 'none',