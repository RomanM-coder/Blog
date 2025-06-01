import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './Bubble.css'

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: {x: number, y: number}; 
}

export const BubbleComponent: React.FC = () => {
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min
 
  // const generatePolyline = () => {
  //   const pointCount = Math.floor(getRandom(6, 10));
  //   return Array.from({ length: pointCount }, () => ({
  //     x: getRandom(0, window.innerWidth),
  //     y: getRandom(0, window.innerHeight)
  //   }))
  // }

  const createBubble = (): Bubble => {
    const size = getRandom(50, 200)    
    const halfSize = size / 2
    const navbarHeight = 60 
    const footerHeight = 50

     // Начальная позиция внутри экрана ---var 0
    const x = getRandom(halfSize, window.innerWidth - size)
    const y = getRandom(halfSize + navbarHeight, window.innerHeight - size - footerHeight - navbarHeight)
  
    // // Корректный расчет доступной области ----var 0
    // const maxX = window.innerWidth - halfSize
    // const maxY = window.innerHeight - halfSize - navbarFooterHeight
    
    // // Убедимся, что пузырь не выходит за границы
    // const x = Math.max(halfSize, Math.min(getRandom(0, window.innerWidth), maxX))
    // const y = Math.max(halfSize, Math.min(getRandom(0, window.innerHeight), maxY))

    // Начальная позиция внутри экрана ----var 2
    // let x = getRandom(halfSize, window.innerWidth - halfSize)
    // let y = getRandom(halfSize, window.innerHeight - halfSize)

    // if (x <= 0) {
    //   x = halfSize      
    // } else if ((x + halfSize) > window.innerWidth) {
    //   x = window.innerWidth - halfSize         
    // }

    // if (y <= 0) {
    //   y = halfSize      
    // } else if ((y + halfSize + 120) > window.innerHeight) {// Navbar + Footer = 120px
    //   y = window.innerHeight - (halfSize*2)    
    // }

    const id = Math.random().toString(36).substring(2, 9)
    console.log('window.innerHeight=', window.innerHeight)
    console.log('window.innerWidth=', window.innerWidth)    
    console.log('id=', id, 'size=', size)
    console.log('x=', x, 'y=', y)
    
    // Случайное направление (нормализованный вектор)
    const angle = getRandom(0, Math.PI * 2)
    const direction = { x: Math.cos(angle), y: Math.sin(angle) }    
    
    return {
      id: id,
      x,
      y,
      size,
      speed: getRandom(0.5, 2),
      direction
    }
  }

  const [bubbles, setBubbles] = useState<Bubble[]>(() => 
    Array.from({ length: 10 }, createBubble)
  )

  const handleBubbleClick = async (id: string) => {

    console.log('handleBubbleClick--ID', id)
    // const filter = bubbles.filter(b => b.id !== id)
    // console.log('handleBubbleClick--filter', filter)
    
  //  // Находим пузырь по id
  //  const bubbleIndex = bubbles.findIndex(b => b.id === id);
  //  if (bubbleIndex === -1) return;

  //  // Создаем копию массива
  //  const updatedBubbles = [...bubbles];
   
  //  // Запускаем анимацию исчезновения
  //  updatedBubbles[bubbleIndex].collapse = true;
  //  setBubbles(updatedBubbles);

    // Ждем немного перед созданием нового пузыря
    //  setTimeout(() => {
      setBubbles(prev => {
        const filtered = prev.filter(b => b.id !== id)
        return [...filtered, createBubble()]
      })
    // }, 500)    
  }  

  return (
    <div className="demo">
      <div className="demo__content">
      <svg className="svg svg--defs">  
            
            {/* Bubble transparency  */}
          <radialGradient id="grad--bw"
                          fx="25%" fy="25%">
            <stop offset="0%" 
                  stopColor="black"/>  
            <stop offset="30%" 
                  stopColor="black" 
                  stopOpacity=".2"/>
            <stop offset="97%" 
                  stopColor="white" 
                  stopOpacity=".4"/>
            <stop offset="100%" 
                  stopColor="black"/>
          </radialGradient>
       
          <mask id="mask" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw)"
                  width="1" height="1"></rect>
          </mask>
       
          {/* градиент бликов  */}
          <radialGradient id="grad--spot"
                          fx="50%" fy="20%">
            <stop offset="10%" 
              stopColor="white"
              stopOpacity=".7"/>  
            <stop offset="70%" 
              stopColor="white"
              stopOpacity="0"/>
          </radialGradient>

          {/* Top & bottom блики  */}
          <radialGradient id="grad--bw-light"
                          fx="25%" fy="10%">
            <stop offset="60%" 
                  stopColor="black" 
                  stopOpacity="0"/>
            <stop offset="90%" 
                  stopColor="white" 
                  stopOpacity=".25"/>
            <stop offset="100%" 
                  stopColor="black"/>
          </radialGradient>
          <mask id="mask--light-top" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)"
                width="1" height="1" transform="rotate(180, .5, .5)"></rect>
          </mask>
        
          <mask id="mask--light-bottom" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)"
                width="1" height="1"></rect>
          </mask>

          {/* Colors of bubble  */}
          <linearGradient id="grad"
                x1="0" y1="100%" x2="100%" y2="0">
            <stop offset="0%" stopColor="dodgerblue" 
                  className="stop-1"/>   
            <stop offset="50%" stopColor="fuchsia"
                  className="stop-2"/>
            <stop offset="100%" stopColor="yellow" 
                  className="stop-3"/>
          </linearGradient>

          {/* Лопание пузыря */}
          <symbol id="splash">
            <g className="splash__group" 
               fill="none"
               stroke="white" strokeOpacity=".8">
              <circle r="49%" 
                  cx="50%" cy="50%"
                  strokeWidth="3%"  
                  strokeDasharray="1% 10%"  
                  className="splash__circle _hidden"
                  ></circle>
              <circle r="44%" 
                  cx="50%" cy="50%"
                  strokeWidth="2%"
                  strokeDasharray="1% 5%" 
                  className="splash__circle _hidden"
                  ></circle>
              <circle r="39%" 
                  cx="50%" cy="50%"
                  strokeWidth="1%"  
                  strokeDasharray="1% 8%"  
                  className="splash__circle _hidden"
                  ></circle>
              <circle r="33%" 
                  cx="50%" cy="50%"
                  strokeWidth="3%"  
                  strokeDasharray="1% 6%"  
                  className="splash__circle _hidden"
                  ></circle>
              <circle r="26%" 
                  cx="50%" cy="50%"
                  strokeWidth="1%"  
                  strokeDasharray="1% 7%"  
                  className="splash__circle _hidden"
                  ></circle>
              <circle r="18%" 
                  cx="50%" cy="50%"
                  strokeWidth="1%"  
                  strokeDasharray="1% 8%"  
                  className="splash__circle _hidden"
                  ></circle>
            </g>
          </symbol>
        </svg>
        
        <div className="demo__defs">
          {bubbles.map((bubble) => (
            <BubbleItem 
              key={bubble.id}
              bubble={bubble}
              onClick={handleBubbleClick}             
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Отдельный компонент для пузыря
const BubbleItem: React.FC<{
  bubble: Bubble;
  onClick: (id: string) => void;  
}> = ({ bubble, onClick }) => {

  const isMounted = useRef(false)
  const shouldStopAnimation = useRef(false) // Новый флаг
  const controls = useAnimation()
  const controlsSplash = useAnimation()
  // const [collapseBubble, setCollapseBubble] = useState(false)

  const [position, setPosition] = useState({ x: bubble.x, y: bubble.y })
  const directionRef = useRef(bubble.direction)
  const speedRef = useRef(bubble.speed)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()  
  
  const animate = (time: number) => {
    //  console.log('isMounted.current+shouldStopAnimation.current', isMounted.current, shouldStopAnimation.current)
    if (!isMounted.current || shouldStopAnimation.current) {
      return
    }
    // console.log('isMounted.current+shouldStopAnimation.current', isMounted.current, shouldStopAnimation.current)
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      const delta = speedRef.current * deltaTime / 16 // Нормализация скорости
      const navbarHeight = 60 
      const footerHeight = 50

      setPosition(prev => {
        let newX = prev.x + directionRef.current.x * delta
        let newY = prev.y + directionRef.current.y * delta
        let newDirection = { ...directionRef.current }
        const size = bubble.size
        const halfSize = bubble.size / 2

        // Проверка столкновения с границами ----0
        if (newX < 0) {
          newX = 0
          newDirection.x = Math.abs(newDirection.x) // Отскок от левой границы
        } else if (newX > (window.innerWidth - size)) {
          newX = window.innerWidth - size
          newDirection.x = -Math.abs(newDirection.x) // Отскок от правой границы
        }

        if ((newY - navbarHeight) < 0) {
          newY = navbarHeight
          newDirection.y = Math.abs(newDirection.y) // Отскок от верхней границы           
        } else if (newY  > (window.innerHeight - size - footerHeight)) { 
          newY = window.innerWidth - size - footerHeight
          newDirection.y = -Math.abs(newDirection.y) // Отскок от нижней границы
        }

        // Проверка столкновения с границами ----var № 1
        // if (newX <= 0) {
        //   newX = bubble.size/2
        //   newDirection.x = Math.abs(newDirection.x) // Отражение от левой границы
        // } else if ((newX + bubble.size) > window.innerWidth) { //+ (bubble.size/2) было
        //   newX = window.innerWidth - bubble.size
        //   newDirection.x = -Math.abs(newDirection.x) // Отражение от правой границы
        // }

        // if (newY <= 0) {
        //   newY = bubble.size/2
        //   newDirection.y = Math.abs(newDirection.y) // Отражение от верхней границы
        // } else if ((newY + bubble.size + navbarFooterHeight) > (window.innerHeight)) {// Navbar + Footer = 120px
        //   newY = window.innerHeight - bubble.size
        //   newDirection.y = -Math.abs(newDirection.y) // Отражение от нижней границы
        // }

         // Проверка левой/правой границы -------var № 2
        // if (newX - halfSize < 0) {
        //   newX = halfSize;
        //   newDirection.x = Math.abs(newDirection.x);
        // } else if (newX + halfSize > window.innerWidth) {
        //   newX = window.innerWidth - halfSize;
        //   newDirection.x = -Math.abs(newDirection.x);
        // }

        // // Проверка верхней/нижней границы с учетом навбара и футера
        // if (newY - halfSize < 0) {
        //   newY = halfSize;
        //   newDirection.y = Math.abs(newDirection.y);
        // } else if (newY + halfSize > window.innerHeight - navbarFooterHeight) {
        //   newY = window.innerHeight - navbarFooterHeight - halfSize;
        //   newDirection.y = -Math.abs(newDirection.y);
        // }

        // Проверка столкновения с границами -------var № 3
        // if (newX <= 0) {
        //   newX = bubble.size/2
        //   newDirection.x = Math.abs(newDirection.x) // Отражение от левой границы
        // } else if ((newX + bubble.size) > window.innerWidth) { //+ (bubble.size/2) было
        //   newX = window.innerWidth - bubble.size
        //   newDirection.x = -Math.abs(newDirection.x) // Отражение от правой границы
        // }

        // if (newY <= 0) {
        //   newY = bubble.size/2
        //   newDirection.y = Math.abs(newDirection.y) // Отражение от верхней границы
        // } else if ((newY + bubble.size + navbarFooterHeight) > window.innerHeight) {// Navbar + Footer = 120px
        //   newY = window.innerHeight - bubble.size
        //   newDirection.y = -Math.abs(newDirection.y) // Отражение от нижней границы
        // }

        directionRef.current = newDirection
        return { x: newX, y: newY }
      })
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  const handleClick = async () => {
    if (!isMounted.current) return

    console.log('handleClick--1')
    
    try {
      // 1. Останавливаем все текущие анимации
      shouldStopAnimation.current = true      
     // 2. Анимация взрыва
      await controlsSplash.start({
        scale: [0, 1.5, 0],
        opacity: [0, 0.7, 0],
        transition: { 
          duration: 0.1,
          ease: "easeOut" 
        }
      })
      console.log('handleClick--2')       
      // 3. Анимация исчезновения
      // shouldStopAnimation.current = true;
      await controls.start({
        scale: 0,
        opacity: 0,
        transition: { 
          duration: 0.1,
          ease: "easeIn" 
        }
      })
      console.log('handleClick--3')
      // shouldStopAnimation.current = true;
      // 4. Вызываем колбэк только если компонент еще смонтирован
      if (isMounted.current) {
        onClick(bubble.id)
      }
    } catch (error) {
      console.error('Animation error:', error)
    }
  }

  useEffect(() => {
    isMounted.current = true
    requestRef.current = requestAnimationFrame(animate)

    // controls.start({
    //   opacity: 1,
    //   scale: 1,
    //   transition: { 
    //     type: "spring",
    //     stiffness: 100,
    //     damping: 10
    //   }
    // })

    // controls.start({      
    //   x: bubble.path.map(p => p.x),
    //   y: bubble.path.map(p => p.y),     
    //   transition: {
    //     duration: bubble.duration,
    //     repeat: Infinity,
    //     repeatType: "loop",
    //     ease: "linear",
    //     times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
    //   }
    // })

    return () => {
      isMounted.current = false
      shouldStopAnimation.current = false
      controls.stop()
      controlsSplash.stop()
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // useEffect(() => {
  //   // При изменении размера окна - корректируем позиции
  //   const handleResize = () => {
  //     setPosition(prev => {
  //       const halfSize = bubble.size / 2;
  //       return {
  //         x: Math.max(halfSize, Math.min(prev.x, window.innerWidth - halfSize)),
  //         y: Math.max(halfSize, Math.min(prev.y, window.innerHeight - halfSize))
  //       };
  //     });
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, [bubble.size])

  // const handleClick = () => {
  //   setCollapseBubble(true)   
  // }

  // useEffect( () => {
  //   isMounted.current = true
    
  //   console.log('useEffect-init')

  //   controls.start({
  //     opacity: 1,
  //     scale: 1,
  //     transition: { 
  //       type: "spring",
  //       stiffness: 100,
  //       damping: 10
  //     }
  //   });

  //   controls.start({      
  //     x: bubble.path.map(p => p.x),
  //     y: bubble.path.map(p => p.y),     
  //     transition: {
  //       duration: bubble.duration,
  //       repeat: Infinity,
  //       repeatType: "loop",
  //       ease: "linear",
  //       times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
  //     }
  //   })
    
  //   return () => {
  //     isMounted.current = false
  //   }
  // }, [])

  // useEffect( () => {    
  //   const collapseble = async () => {
  //     console.log('useEffect-collapseble')
      
  //     // Анимация взрыва
  //     await controlsSplash.start({
  //       scale: [0, 1.2, 1],
  //       opacity: [0, 0.5, 0],
  //       transition: { duration: 0.2 }
  //     })
  //     //  Анимация исчезновения пузыря
  //     await controls.start({
  //       scale: 0,
  //       opacity: 0,
  //       transition: { duration: 0.05 }
  //     })
  //     onClick(bubble.id)
  //   }
  //   if (collapseBubble) {
  //     collapseble();
  //   }
    
  //   return () => {
  //     isMounted.current = false
  //   }
  // }, [collapseBubble])
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      x: position.x,
      y: position.y,
      transition: { duration: 0 }
    });
  }, [position])  

  return (
    <motion.svg      
      className="svg bubble"
      onClick={handleClick}
      viewBox="0 0 200 200"
      style={{
        // position: 'absolute',
        // left: `${bubble.x/10}px`,
        // top: `${bubble.y/10}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        cursor: 'pointer'
      }}      
      // initial={{ 
      //   x: bubble.path[0].x, 
      //   y: bubble.path[0].y,
      //   opacity: 0,
      //   scale: 0
      // }}
      initial={{ opacity: 0, scale: 0 }}
      animate={controls}
      // animate={{
      //   x: bubble.path.map(p => p.x),
      //   y: bubble.path.map(p => p.y),
      //   opacity: 1,
      //   scale: 1
      // }}
      // transition={{
      //   x: {
      //     duration: bubble.duration,
      //     repeat: Infinity,
      //     repeatType: "loop",
      //     ease: "linear",
      //     times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
      //   },
      //   y: {
      //     duration: bubble.duration,
      //     repeat: Infinity,
      //     repeatType: "loop",
      //     ease: "linear",
      //     times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
      //   },
      //   opacity: { duration: 0.5 },
      //   scale: { duration: 0.5 }
      // }}
      // transition={{
      //   opacity: { duration: 0.5 },
      //   scale: { duration: 0.5 }
      // }}
    > 
      <g>
    {/* блик справа снизу */}
    <ellipse rx="20%" ry="10%"
            cx="150" cy="150"
            fill="url(#grad--spot)"
            transform="rotate(-225, 150, 150)"
            className="shape _hidden"    
            ></ellipse> 
            {/* блик сверху слева */}
    <ellipse rx="55" ry="25"
            cx="55" cy="55"
            fill="url(#grad--spot)"
            transform="rotate(-45, 55, 55)"
            className="shape _hidden"    
    ></ellipse> 
        {/* круг с градиентом + маска */}   
    <circle r="50%" 
            cx="50%" cy="50%"
            fill="url(#grad)"
            mask="url(#mask)"
            className="shape _hidden"
    ></circle>
    {/* круг с цветом aqua + маска */}
    <circle r="50%" 
            cx="50%" cy="50%"
            fill="aqua"
            mask="url(#mask--light-bottom)"
            className="shape _hidden"
    ></circle>
          {/* круг с цветом yellow + маска */}
    <circle r="50%" 
            cx="50%" cy="50%"
            fill="yellow"
            mask="url(#mask--light-top)"
            className="shape _hidden"
    ></circle>     
      <motion.use
        key={bubble.id}
        xlinkHref="#splash"
        className="bubble__splash"
        initial={{ opacity: 0, scale: 0 }}
        animate={controlsSplash}
        // style={{ opacity: 0 }}
      ></motion.use>
      </g>
    </motion.svg>
  )
}