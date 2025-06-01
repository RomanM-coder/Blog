import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './SecondScreen.module.css'

export const SecondScreen: React.FC = () => {
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null) // Текущий активный индекс
  const refs = useRef<(HTMLDivElement | null)[]>([]) // Массив рефов для каждого элемента

  const array1 = [
    'Lorem ipsum dolor', 'consectetur adipisicing', 'Est similique quae', 'Suscipit commodi', 'necessitatibus officiis', 'aperiam unde quod', 'consectetur adipisicing', 'Lorem ipsum dolor'
  ]
  const array2 = [
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est similique quae ullam nemo dignissimos. Suscipit commodi, aperiam unde quod aut reprehenderit quo blanditiis', 'Suscipit commodi, aperiam unde quod aut reprehenderit quo blanditiis necessitatibus officiis ad cum, accusantium illo repellendus?', 'Est similique quae ullam nemo dignissimos. Suscipit commodi', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Suscipit commodi, aperiam unde quod aut reprehenderit quo blanditiis necessitatibus officiis ad cum', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est similique quae ullam nemo', 'Suscipit commodi, aperiam unde quod aut reprehenderit quo blanditiis'
  ]

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const index = entry.target.getAttribute('data-index') // Получаем индекс элемента
  //           console.log('index=', index)
  //           if (index !== null) {
  //             setActiveIndex(Number(index)) // Устанавливаем активный индекс
  //           }
  //         }
  //       })
  //     },
  //     { threshold: 0.5} // Элемент считается видимым, если хотя бы 50% его находится на экране , rootMargin: '-50% 0px' 
  //   )

  //   // Наблюдаем за каждым элементом
  //   refs.current.forEach((ref) => {
  //     if (ref) observer.observe(ref)
  //   })

  //   // Очищаем наблюдателя при размонтировании компонента
  //   return () => {
  //     refs.current.forEach((ref) => {
  //       if (ref) observer.unobserve(ref)
  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY // Текущая позиция прокрутки
  //     console.log('window.innerHeight=', window.innerHeight)
  //     console.log('window.scrollY=', scrollTop)
  //     const activeElement = refs.current.findIndex((el, i) => {
  //       console.log('els=', el)
        
  //       if (!el) return false
  
  //       const rect = el.getBoundingClientRect() // Получаем размеры и позицию элемента       
  //       console.log('rect.top=', i, rect.top)
        
  //       // return rect.top >= 0 && rect.top <= window.innerHeight * 0.5  // Элемент считается
  //       //  активным, если он в верхней половине viewport
  //       return rect.top <= 0 
  //     })
  useEffect(() => {
    let lastScrollY = window.scrollY // Храним предыдущую позицию скролла

    const handleScroll = () => {      
      const scrollTop = window.scrollY
      console.log('window.scrollY=', scrollTop) 
      const isScrollingDown = scrollTop > lastScrollY; // Проверяем направление прокрутки     
      lastScrollY = scrollTop

      const activeElement = refs.current.findIndex((el, i) => {
        if (!el) return false

        // const offsetTop = el.offsetTop; // Положение элемента относительно начала документа
        // const elementHeight = el.clientHeight; // Высота элемента

        //Определяем диапазон активности элемента
        // const isActive =
        //   scrollTop + window.innerHeight / 2 >= offsetTop &&
        //   scrollTop + window.innerHeight / 2 <= offsetTop + elementHeight
        const viewportCenter = window.innerHeight / 2; // Центр viewport
        const margin = isScrollingDown ? -20 - i * 30 : 0

        const rect = el.getBoundingClientRect() // Получаем размеры и позицию элемента
        console.log('rect.top=', i, rect.top)
        const isActive = // Элемент активен, если его центр находится близко к центру viewport
          rect.top + margin + rect.height / 2 >= viewportCenter - 100 &&
          rect.top + margin + rect.height / 2 <= viewportCenter + 100

        return isActive
         // window.scrollY >= sec.offsetTop && window.scrollY < sec.offsetTop + sec.offsetHeight

        // if (isActive) {
        //   // Исключаем крайние элементы при движении за их пределы
        //   if (
        //     (isScrollingDown && i === refs.current.length - 1) || // При прокрутке вниз последний элемент теряет активность
        //     (!isScrollingDown && i === 0) // При прокрутке вверх первый элемент теряет активность
        //   ) {
        //     return false
        //   }
        //   return isActive
        // }
        // return false        
      })

      console.log('rect.activeElement=', activeElement)
      if (activeElement !== -1 && activeElement !== activeIndex) {
        console.log('rect.activeElement=----------------------------')        
        setActiveIndex(activeElement)
      } else if ( activeElement === -1 ) {
        setActiveIndex(null)
      }
    }
  
    // Добавляем слушатель прокрутки
    window.addEventListener('scroll', handleScroll)
  
    // Удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={styles.landingContainer}>
      <h2>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      </h2>
      {array1.map((arr, index) => (
        <motion.div
          key={index}
          ref={(el) => (refs.current[index] = el)} // Сохраняем реф для каждого элемента
          data-index={index} // Добавляем атрибут с индексом
          className={`${styles.screenWrapper} ${activeIndex === index ? styles.active : ''}`}
          initial={{ opacity: 0, y: 50 }} // Начальное состояние
          whileInView={{ opacity: 1, y: 0 }} // Анимация при попадании в viewport
          animate={activeIndex === index 
            ? { scale: 1.1, color: '#ff0000' } // Активное состояние
            : { scale: 1, color: '#000' } // Неактивное состояние
          }          
          transition={{ duration: 0.5 }}
          viewport={{ once: false }} // Анимация срабатывает не один раз
        >
          <p>{arr}</p>
          {activeIndex === index && <p className={styles.array2Description}>{array2[index]}</p>}
      </motion.div>
      ))}
      <h3>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      </h3>
      <h3>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quia aliquid consequatur sit debitis soluta assumenda quas unde dicta eveniet voluptatum repellendus beatae quasi asperiores, voluptate inventore non nemo aliquam.
      </h3>
    </div>    
  )
}  