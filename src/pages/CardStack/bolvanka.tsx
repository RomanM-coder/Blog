import React, { useState, useEffect, useRef } from 'react'
import styles from './CardStack.module.css'

export const CardStack: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)  
  const cards = [
    'Card 1',
    'Card 2',
    'Card 3',
    'Card 4',
    'Card 5',
    'Card 6',
  ]
  
  useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      lastScrollY = currentScrollY
      
      const activeElement = cardRefs.current.findIndex((el, i) => {
        if (!el) return false        
        const viewportCenter = window.innerHeight / 2                
        const rect = el.getBoundingClientRect()        
        const isActive = 
          rect.top  + (rect.height / 2) >= viewportCenter - 100 &&
          rect.top  + (rect.height / 2) <= viewportCenter + 100       
        return isActive  
      })           
      setActiveIndex(activeElement !== -1 ? activeElement : null)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={styles.cardContainer}>
      <h2>Lorem ... aliquam.
      </h2>      
      <div className={styles.cards}>
        <div style={{position: 'sticky', top: '15px', marginTop: '0px', transition: 'top .3s ease-in-out'}}>
          <h3>
            Lorem ... aliquam.            
          </h3>
        </div>
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={styles.cardWrapper + `${(index === activeIndex) ? ' '+styles.active : ''}`} 
            style={{              
              position: 'sticky',
              top: '200px',
              marginTop: (index !== 0) ? '-30px' : '0px',
              zIndex: index + 1
            }}            
          >
            <div className={styles.cardContent}>
              <h2>{card}</h2>
              <p>Lorem ... inventore.
              </p>             
            </div>
          </div>
        ))}
      </div>
      <h3>Lorem ... aliquam.
      </h3>      
    </div>
  )
}


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

  const createBubble = (): Bubble => {
    const size = getRandom(50, 200)    
    const halfSize = size / 2
    const navbarHeight = 60 
    const footerHeight = 60
     
    const x = getRandom(halfSize, window.innerWidth - halfSize)
    const y = getRandom(halfSize + navbarHeight, window.innerHeight - halfSize - footerHeight)    
   
    const angle = getRandom(0, Math.PI * 2)
    const direction = { x: Math.cos(angle), y: Math.sin(angle) }    
    
    return {
      id: Math.random().toString(36).substring(2, 9),
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
  
    setBubbles(prev => {
      const filtered = prev.filter(b => b.id !== id)
      return [...filtered, createBubble()]
    })      
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
  const shouldStopAnimation = useRef(false)
  const controls = useAnimation()
  const controlsSplash = useAnimation()  

  const [position, setPosition] = useState({ x: bubble.x, y: bubble.y })
  const directionRef = useRef(bubble.direction)
  const speedRef = useRef(bubble.speed)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()  
  
  const animate = (time: number) => {
   
    if (!isMounted.current || shouldStopAnimation.current) {
      return
    }
    
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      const delta = speedRef.current * deltaTime / 16 
      const navbarHeight = 60 
      const footerHeight = 60

      setPosition(prev => {
        let newX = prev.x + directionRef.current.x * delta
        let newY = prev.y + directionRef.current.y * delta
        let newDirection = { ...directionRef.current }
        const halfSize = bubble.size / 2
       
        if (newX - halfSize < 0) {
          newX = halfSize
          newDirection.x = Math.abs(newDirection.x) 
        } else if (newX + halfSize > window.innerWidth) {
          newX = window.innerWidth - (halfSize)
          newDirection.x = -Math.abs(newDirection.x) 
        }

        if (newY - halfSize - navbarHeight < 0) {
          newY = halfSize + navbarHeight
          newDirection.y = Math.abs(newDirection.y)           
        } else if (newY + halfSize + footerHeight > window.innerHeight) { 
          newY = window.innerHeight - halfSize - footerHeight
          newDirection.y = -Math.abs(newDirection.y) 
        }

        directionRef.current = newDirection
        return { x: newX, y: newY }
      })
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  const handleClick = async () => {
    if (!isMounted.current) return
    try {      
      shouldStopAnimation.current = true      
    
      await controlsSplash.start({
        scale: [0, 1.5, 0],
        opacity: [0, 0.7, 0],
        transition: { 
          duration: 0.1,
          ease: "easeOut" 
        }
      })
     
      await controls.start({
        scale: 0,
        opacity: 0,
        transition: { 
          duration: 0.1,
          ease: "easeIn" 
        }
      })
      
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
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        cursor: 'pointer'
      }}     
      initial={{ opacity: 0, scale: 0 }}
      animate={controls}      
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
      ></motion.use>
      </g>
    </motion.svg>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import styles from './TextGooey.module.css'

const numbers = [
  "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
  "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8",  
]

export const TextGooey: React.FC = () => {

  const [index, setIndex] = useState(0);
  const circles = useRef<SVGCircleElement[]>([]);
  const paths = useRef<SVGPathElement[]>([]);
  const nbOfCircles = 45;
  const radius = 10;

  useEffect( () => {
    const length = paths.current[index].getTotalLength();
    const step = length / nbOfCircles;

    circles.current.forEach((circle, i) => {
      const { x, y } = paths.current[index].getPointAtLength(i * step);
      console.log('x=', x, 'y=', y, 'index=', index)      
      animate(circle, 
        { cx: x , cy: y }, 
        { delay: i * 0.025, ease: "easeOut"}
      )
    })
  }, [index])

  useEffect(() => {
    const interval = setInterval(() => {      
      setIndex((prev) => {        
        if (prev === numbers.length - 1) {
          return 0
        } else return prev + 1
      })      
    }, 2000)

    return () => {
      if (interval) clearInterval(interval)     
    } 
  }, [])

  return (
    <main className={styles.main}> 
      <div className={styles.numbers}>
        {numbers.map((_, i) => {
          return <p 
            style={{color: i == index ? "red" : "black"}}           
            key={`color${i}`}
            >{i + 1}</p>
        })}
      </div>
      <div>
        {numbers.map((path, i) => {
          return (
            <svg viewBox="0 0 256 256" key={`svg_${i}`}>
              <defs>
                <filter id="filter">
                  <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15" result="filter" />
                </filter>
              </defs>
              <g>
                <path                  
                  ref={ref => {if (ref) paths.current[i] = ref}} 
                  d={path}/>                
              </g>

              <g>
                {[...Array(nbOfCircles)].map( (_, i) => {
                  return <circle 
                    key={`circle_${i}`} 
                    ref={ref => {if (ref) circles.current[i] = ref}} 
                    cx="128" cy="128" r={radius} />
                })}
              </g>
            </svg>
          )
      })}
      </div>     
    </main>
  )
}


import React, { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import styles from './TextGooey.module.css'

const numbers = [
  "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
  "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8"  
]

export const TextGooey: React.FC = () => {

  const [index, setIndex] = useState(0) 
  const circles = useRef<SVGCircleElement[]>([])
  const paths = useRef<SVGPathElement[]>([])
  const nbOfCircles = 45
  const radius = 10
  console.log('circles=', circles)  

  useEffect( () => {    
    const length = paths.current[index].getTotalLength()
    const step = length / nbOfCircles

    circles.current.forEach((circle, i) => {     
      const { x, y } = paths.current[index].getPointAtLength(i * step)
      console.log('x=', x, 'y=', y, 'index=', index)      
      animate(circle, 
        { cx: x, cy: y }, 
        { delay: i * 0.025, ease: "easeOut"}
      )
    })
  }, [index])

  useEffect(() => {
    const interval = setInterval(() => {      
      setIndex((prev) => {        
        if (prev === numbers.length - 1) {
          return 0
        } else return prev + 1
      })      
    }, 2000)

    return () => {
      if (interval) clearInterval(interval)     
    } 
  }, [])

  return (
    <main className={styles.main}> 
      <div className={styles.numbers}>
        {numbers.map((_, i) => {
          return <p 
            style={{color: i == index ? "red" : "black"}}           
            key={`color${i}`}
            >{i + 1}</p>
        })}
      </div>      
      <svg viewBox="0 0 256 256">
        <defs>
          <filter id="filter">
            <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15" 
              result="filter" />
          </filter>
        </defs>
        <g>
          {numbers.map((path, i) => {
            return <path 
              key={`p_${i}`} 
              ref={ref => { if (ref) paths.current[i] = ref }} 
              d={path}/>
          })}
        </g>
        <g>
          {[...Array(nbOfCircles)].map( (_, i) => {
            return <circle 
              key={`c_${i}`} 
              ref={ref => { if (ref) circles.current[i] = ref }} 
              cx="128" cy="128" r={radius} />
          })}
        </g>
      </svg>     
    </main>
  )
}
Как мне пеоеделать код (который выше) для того чтобы цифры собирались бы в текст, т.е. чтобы каждая новая цифра рисовалась(анимировалась) на своем месте. Например: Экран разделен на 2 части. 1-я часть - это отображение номера пути (1, 2, ...), цвет - активность цифры и 2-я часть - разделена на (в данном случае 2) количество цифр и каждая следующая цифра показывается правее на (например) 400px. Итогом выполнения кода будет цифра 1, показанная с анимацией, она остается (до завершения анимации всех цифр) и показывается (анимируется) следующая цифра 2 правее на 400px по горизонтали и тоже остается. Анимация продолжается 2с + 2с = 4с. После этого все повторяется. Как мне это сделать?


import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, animate } from 'framer-motion';
import styles from './TextGooey.module.css'

const numbers = [  
   "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
   "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8"  
]

export const TextGooey: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const nbOfCircles = 45
  const radius = 10
 
  const [animatedDigits, setAnimatedDigits] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {      
      setAnimatedDigits((prev) => {
        if (prev.length === numbers.length) {         
          setActiveIndex(0);
          return [];
        }
        const nextDigit = prev.length;
        setActiveIndex(nextDigit);
        return [...prev, nextDigit];
      });
    }, 6000)
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>     
      <div className={styles.numbers}>
        {numbers.map((_, i) => (
          <p
            key={`number-${i}`}
            style={{ color: i === activeIndex ? "red" : "black" }}
          >
            {i + 1}
          </p>
        ))}
      </div>
      
      <div className={styles.animationContainer}>
        {animatedDigits.map((digitIndex, i) => (
          <AnimatedDigit
            key={`digit-${digitIndex}`}
            path={numbers[digitIndex]}
            index={digitIndex}
            nbOfCircles={nbOfCircles}
            radius={radius}
            xOffset={i * 400}          
          />
        ))}
      </div>
    </main>
  );
};

// Компонент для анимации одной цифры
const AnimatedDigit: React.FC<{
  path: string;
  index: number;
  nbOfCircles: number;
  radius: number;
  xOffset: number  
}> = ({ path, index, nbOfCircles, radius, xOffset }) => {

  console.log(`Filter ID: filter-${index}`)
  const circles = useRef<SVGCircleElement[]>([]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false); // Флаг для отслеживания анимации

  useEffect(() => {
    if (!pathRef.current) return
    
    const animateCircles = async () => {
       if (!pathRef.current || isAnimating) return
       setIsAnimating(true)

      const length = pathRef.current!.getTotalLength()
      const step = length / nbOfCircles

      for (let i = 0; i < nbOfCircles; i++) {
        const circle = circles.current[i];
        if (!circle) continue;

        const { x, y } = pathRef.current!.getPointAtLength(i * step)        
        animate(circle, 
          { cx: x, cy: y }, 
          { delay: i * 0.025, ease: "easeOut"}
        )   
      }
      setIsAnimating(false)
    }
    animateCircles()

  }, [index])

  return (
    <svg
      viewBox="0 0 256 256"
      style={{ position: "absolute", left: `${xOffset}px` }}
    >
      <defs>
        {/* <filter id={`filter-${index}`}>          
          <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
            result="filter"
          />
        </filter> */}
      </defs>
      <g>
        <path
          ref={(ref) => (pathRef.current = ref)}
          d={path}
        />
      </g>
      <g>
        {[...Array(nbOfCircles)].map((_, i) => {
          // console.log(`Filter ID: filter-${index}`);
          return (
          <circle
            key={`circle-${i}`}
            ref={(ref) => { if (ref) circles.current[i] = ref }}
            cx="128" cy="128"
            r={radius}
            // style={{ filter: `url(#filter-${index})` }}            
          />)
        })}
      </g>
    </svg>
  );
};

//------------------------------------
import React, { useState, useEffect, useRef } from "react"
import { ruble, pound, euro} from "./paths"
import { motion, useMotionValue, useTransform, animate, useAnimation } from "framer-motion"
import { getIndex, useFlubber } from "./use-flubber"
import "./Morph.css"

const paths = [ruble, euro, pound]
const colors = [
  "#00cc88",
  "#0099ff",
  "#8855ff" 
];

export const Morph = () => {
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  const fill = useTransform(progress, paths.map(getIndex), colors);
  const path = useFlubber(progress, paths);

  useEffect(() => {
    const animation = animate(progress, pathIndex, {
      duration: 0.8,
      ease: "easeInOut",
      onComplete: () => {
        if (pathIndex === paths.length - 1) {
          progress.set(0);
          setPathIndex(1);
        } else {
          setPathIndex(pathIndex + 1);
        }
      }
    });

    return () => animation.stop();
  }, [pathIndex]);

  return (
    <div style={{paddingTop: '150px'}}>
      <svg width="400" height="400">
        <g transform="translate(10 10) scale(17 17)">
          <motion.path fill={fill} d={path} />
        </g>
      </svg>
    </div>
  );
}

// useFlubber
import { interpolate } from "flubber";
import { MotionValue, useTransform } from "framer-motion";

export const getIndex = (_: any, index: number) => index;

export function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 })
  });
}



{/* <AnimatePresence> 
  <motion.div
    key="mobileMenu"
    className={styles.mobileMenu}      
    initial="closed"
    animate={isOpenHamburger ? "open" : "closed"}
    exit="closed"                             
  >
    <motion.ul 
      className={styles.navLinksVertical}
      variants={{
        open: {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0% round 10px)",                    
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.5,
            delayChildren: 0.3,
            staggerChildren: 0.1
          }
        },
        closed: {
          opacity: 0,
          clipPath: "inset(10% 50% 90% 50% round 10px)",
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.3,
            when: "afterChildren",
            staggerDirection: -1,
            staggerChildren: 0.06
          }
      }}}
    >
      {navItems.map((item, index) => (
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
          variants={{
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
              transition: { duration: 0.2 }
            }
          }}     
        >         
          <li className={styles.menuMainPosts}>           
            <motion.div 
              className={styles.namePosts}
              onClick={(event) => toggleDropdownParent(event, 1)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}        
            >
              {t('navBar.posts')}
            </motion.div> 
            //  Подменю
            <AnimatePresence>
            {isOpen && <motion.div        
              className={styles.postDropdown}        
              key={'postDropdown'}
              ref={motionElemRef}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              exit="closed"                  
            >      
              <motion.ul 
                className={styles.dropdownContent}
                variants={{
                  open: {
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0% round 10px)",                    
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.5,
                      delayChildren: 0.3,
                      staggerChildren: 0.1
                    }
                  },
                  closed: {
                    opacity: 0,
                    clipPath: "inset(10% 50% 90% 50% round 10px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                      when: "afterChildren",
                      staggerDirection: -1,
                      staggerChildren: 0.06
                    }
                  }
                }}
              >
                {categoryList?.length && categoryList.map((category) => (
                  <motion.li 
                    key={`${category._id}`} 
                    aria-checked={activeSubPage === category.name}
                    className={styles.menuSub}
                    variants={{
                      open: {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: { type: "spring", stiffness: 300, damping: 24 }
                      },
                      closed: {
                        opacity: 0,
                        scale: 0.3,
                        filter: "blur(20px)",
                        transition: { duration: 0.2 }
                      }
                    }}              
                  >           
                    <NavLink 
                      to={`/posts/${category._id}`}                   
                      onClick={toggleDropdown}
                    >
                      {category.name}
                    </NavLink>                   
                  </motion.li>           
                ))}              
              </motion.ul>               
            </motion.div>      
            }
            </AnimatePresence>
          </li>
        </motion.div>
      ))}
    </motion.ul>
  </motion.div>  
</AnimatePresence> */}

const [isClickRedCross, setIsClickRedCross] = useState(false)
<button
  className={styles.hamburger}
  onClick={() => {                   
    if (isOpenHamburger) {                          
      setIsClickRedCross(true)
      if (isOpen) {                
        setIsOpen(false)
      } else {                
        setIsOpenHamburger(false)
      }
    } else {              
      setIsOpenHamburger(true)
      setIsClickRedCross(false)
    }                  
  }}          
>Hamburger icon</button>
<AnimatePresence mode='wait'>
  {isOpenHamburger && <motion.div
    key="mobileMenu"
    className={styles.mobileMenu}      
    initial="closed"
    animate={isOpenHamburger ? "open" : "closed"}
    exit="closed"
    variants={{
      open: {
        opacity: 1,
        x: 0,                                 
        transition: {
          type: "spring",
          bounce: 0,
          duration: 0.5,
          delayChildren: 0.3,
          staggerChildren: 0.1
        }
      },
      closed: {
        opacity: 0,
        x: -20,       
        transition: {
          type: "spring",
          bounce: 0,
          duration: 0.3,
          when: "afterChildren",
          staggerDirection: -1,
          staggerChildren: 0.06
        }
      }}
    }                             
  >
    <ul>      
      <motion.div 
        key={getKey}              
        variants={{
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
          }}
        }   
      > 
        <li>
          ...
        </li>        
        <li>           
          <motion.div               
            onClick={(event) => toggleDropdownParent(event, 1)}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}        
          >
            Posts
          </motion.div> 
            {/* Подменю */}            
            {isOpen && <motion.div        
              className={styles.postDropdown}        
              key="postDropdown"             
              initial="dropdownOpen"
              animate={isOpen ? "dropdownOpen" : "dropdownClose"} 
              variants={{
                dropdownOpen: {
                  opacity: 1,
                  clipPath: "inset(0% 0% 0% 0% round 8px)",                    
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.5,
                    delayChildren: 0.3,
                    staggerChildren: 0.1
                  }
                },
                dropdownClose: {
                  opacity: 0,
                  clipPath: "inset(10% 50% 90% 50% round 8px)",
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.3,
                    when: "afterChildren",
                    staggerDirection: -1,
                    staggerChildren: 0.06
                  }
                }}
              }
              onAnimationComplete={(definition) => {
                console.log('Animation completed:', definition) 
                console.log('isClickRedCross:', isClickRedCross)         
                if (definition === "dropdownClose" && isClickRedCross) {
                  // После закрытия подменю закрываем основное меню           
                  setIsOpenHamburger(false)
                }
              }}                             
            >      
              <ul >
                {categoryList.map((category) => (
                  <motion.li 
                    key={`${category._id}`}                    
                    variants={{
                      dropdownChildOpen: {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: { type: "spring", stiffness: 300, damping: 24 }
                      },
                      dropdownChildClose: {
                        opacity: 0,
                        scale: 0.3,
                        filter: "blur(20px)",
                        transition: { duration: 0.2 }
                      }}
                    }            
                  >           
                    <NavLink 
                      to={`/posts/${category._id}`}                   
                      onClick={toggleDropdown}
                    >
                      {category.name}
                    </NavLink>                   
                  </motion.li>           
                ))}              
              </ul>               
            </motion.div>      
            }           
          </li>
        </motion.div>      
    </ul>
  </motion.div>  
</AnimatePresence>

import { useGlobalState } from './useGlobalState'
import { useEffect, useState, memo, ReactNode } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { SocketContext, socket } from './context/SocketContext'
import { NavBar } from './components/NavBar/NavBar'
import { Footer } from './components/Footer/Footer'
import { useRoutes } from './routes'
import { useAuth } from './pages/AuthPage/auth.hook'
import { CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

interface AnimatedPageProps {
  children: ReactNode;
}

// Компонент для обертывания страниц
const AnimatedPage = memo(({ children }: AnimatedPageProps) => {
  const location = useLocation() 

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -100 }}       
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 100 }} 
        transition={{ duration: 0.5 }} 
        style={{ position: 'absolute', width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
})

const App: React.FC = () => {  
  const [itemSearch, setItemSearch] = useGlobalState('itemSearch')  
  const [lastScrollY, setLastScrollY] = useState(0)
  const {login, logout, token, userId, ready} = useAuth()  
  const routes = useRoutes() 

  if (userId) {
    if (!ready) {
      return (
        <div style={{position: 'relative'}}>
          <CircularProgress style={{position: 'absolute', left: '50%', bottom: '-300px'}} />
        </div>
      )
    }
  }

  useEffect(()=> {}, [itemSearch])
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY      
      setLastScrollY(currentScrollY) 
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    lastScrollY
  ])

  return (
    <AuthContext.Provider value={{ token, userId, login, logout}}>     
      <BrowserRouter>
        <div className='Glob' style={{ position: 'relative' }}>
          <div
            key='header_nav' 
            className={ lastScrollY > 60 ? 'navBarWrapper header_scrolled' : 'navBarWrapper' } 
          > 
            <NavBar />
          </div>
          <SocketContext.Provider value={socket}>
            <AnimatedPage> 
              {routes}
            </AnimatedPage> 
          </SocketContext.Provider>       
          <Footer /> 
        </div>
      </BrowserRouter>      
    </AuthContext.Provider>
  )
}
export default App