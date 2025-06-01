import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion'
import './Bubble.css'

// Тип для пузыря
interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  path: {x: number, y: number}[]  
}

interface BubbleProps { 
  bubble: Bubble;
  setBubbles: React.Dispatch<React.SetStateAction<Bubble[]>>
  createBubble: () => Bubble
}

const Bubble: React.FC<BubbleProps> = ({ bubble, setBubbles, createBubble }) => {

  const controlsSplash = useAnimation()

  // Обработчик клика по пузырю
  const handleBubbleClick = async (id: string) => {
    // setCollapseBubble(id)       
   // await new Promise((resolve) => setTimeout(resolve, 0))
    // Запускаем анимацию брызг
    await controlsSplash.start({ scale: 1.5, opacity: 1, transition: { duration: 0.05 } })
    
    setBubbles(prevBubbles => {
      // Удаляем лопнувший пузырь
      const filtered = prevBubbles.filter(bubble => bubble.id !== id)
      // Добавляем новый пузырь
      return [...filtered, createBubble()]
    })
  }

  return (
    <motion.svg
      className="svg bubble"
      key={bubble.id}
      onClick={() => handleBubbleClick(bubble.id)}
      viewBox="0 0 200 200"
      style={{
        // position: 'absolute',
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        // borderRadius: '50%',
        // backgroundColor: `rgba(135, 206, 250, ${getRandom(0.4, 0.8)})`,
        cursor: 'pointer',
        // transform: 'translate(-50%, -50%)',
        // boxShadow: '0 0 10px rgba(135, 206, 250, 0.5)'
      }}
      initial={{ 
        x: bubble.path[0].x, 
        y: bubble.path[0].y,
        opacity: 0,
        scale: 0
      }}
      animate={{
        x: bubble.path.map(p => p.x),
        y: bubble.path.map(p => p.y),
        opacity: 1,
        scale: 1
      }}
      transition={{
        x: {
          duration: bubble.duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
        },
        y: {
          duration: bubble.duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
        },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }}         
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
      key={`splash-${bubble.id}`} 
      xlinkHref="#splash" 
      // className={(collapseBubble === bubble.id) ? "bubble__splash active" : "bubble__splash"}
      className="bubble__splash"
      // initial={{opacity: 1, scale: 1.5}}
      initial={{opacity: 0, scale: 0}}
      animate={controlsSplash}
      transition={{duration: 0.2}}
    ></motion.use>
    </g>        
    </motion.svg>
  )
}

export const BubbleComponent: React.FC = () => {
  // Генерация случайного числа в диапазоне
  const getRandom = (min: number, max: number) => 
    Math.random() * (max - min) + min;

  const generatePolyline = () => {
    const pointCount = Math.floor(getRandom(6, 10));
    return Array.from({ length: pointCount }, () => ({
      x: getRandom(0, window.innerWidth),
      y: getRandom(0, window.innerHeight)
    }));
  };

  // Создание нового пузыря
  const createBubble = (): Bubble => ({
    id: Math.random().toString(36).substring(2, 9),
    x: getRandom(0, window.innerWidth),
    y: getRandom(0, window.innerHeight),
    size: getRandom(50, 200),
    duration: getRandom(35, 45), // Случайная продолжительность анимации
    path: generatePolyline()
  })

  // Инициализация 5 пузырей
  const [bubbles, setBubbles] = useState<Bubble[]>(() => 
    Array.from({ length: 5 }, createBubble)
  )
  // const [collapseBubble, setCollapseBubble] = useState<string|null>(null)  
  // const controlsSplash = useAnimation()  

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
        {bubbles.map((bubble, index) => (
          <Bubble
            key={bubble.id}             
            bubble={bubble} 
            setBubbles={setBubbles}
            createBubble={createBubble}
          />        
      ))}
    </div>
    </div>
    </div>
  )
}