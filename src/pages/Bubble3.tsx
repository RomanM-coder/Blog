import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './Bubble.css'

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  path: {x: number, y: number}[];
  // collapse: boolean
}

export const BubbleComponent: React.FC = () => {
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min

  const generatePolyline = () => {
    const pointCount = Math.floor(getRandom(6, 10));
    return Array.from({ length: pointCount }, () => ({
      x: getRandom(0, window.innerWidth),
      y: getRandom(0, window.innerHeight)
    }))
  }

  const createBubble = (): Bubble => ({
    id: Math.random().toString(36).substring(2, 9),
    x: getRandom(0, window.innerWidth),
    y: getRandom(0, window.innerHeight),
    size: getRandom(50, 200),
    duration: getRandom(35, 45),
    path: generatePolyline(),
    // collapse: false
  })

  const [bubbles, setBubbles] = useState<Bubble[]>(() => 
    Array.from({ length: 5 }, createBubble)
  );

  const handleBubbleClick = async (id: string) => {

    // console.log('handleBubbleClick--ID', id)
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
     setTimeout(() => {
      setBubbles(prev => {
        const filtered = prev.filter(b => b.id !== id)
        return [...filtered, createBubble()]
      })
    }, 500)    
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
              // createBubble={createBubble}
              // collapse={bubble.collapse}
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
  onClick: (id: string) => void
  // setBubbles: React.Dispatch<React.SetStateAction<Bubble[]>>,
  // createBubble: () => Bubble
  // collapse: boolean;
}> = ({ bubble, onClick
  // , collapse 
}) => {
  const isMounted = useRef(false)
  const controls = useAnimation()
  const controlsSplash = useAnimation()
  const [collapseBubble, setCollapseBubble] = useState(false)

  // const handleSplash = async (id: string) => {
  //   await controlsSplash.start({ scale: 1.5, opacity: 1, transition: { duration: 0.05 } })
  //   setBubbles(prevBubbles => {
  //     // Удаляем лопнувший пузырь
  //     const filtered = prevBubbles.filter(bubble => bubble.id !== id)
  //     // Добавляем новый пузырь
  //     return [...filtered, createBubble()]
  //   })
  // }

  const handleClick = () => {
    setCollapseBubble(true)   
  }

  useEffect( () => {
    isMounted.current = true
    
    console.log('useEffect-init')

    controls.start({
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    });

    controls.start({      
      x: bubble.path.map(p => p.x),
      y: bubble.path.map(p => p.y),     
      transition: {
        duration: bubble.duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        times: bubble.path.map((_, i) => i/(bubble.path.length - 1))
      }
    })
    
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect( () => {    
    const collapseble = async () => {
      console.log('useEffect-collapseble')
      
      // Анимация взрыва
      await controlsSplash.start({
        scale: [0, 1.2, 1],
        opacity: [0, 0.5, 0],
        transition: { duration: 0.2 }
      })
      //  Анимация исчезновения пузыря
      await controls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.05 }
      })
      onClick(bubble.id)
    }
    if (collapseBubble) {
      collapseble();
    }
    
    return () => {
      isMounted.current = false
    }
  }, [collapseBubble])

    // useEffect(() => {
    //   controls.start(isOpen ? "open" : "closed");
    // }, [isOpen]);
    
    // const menuVariants = {
    //   open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    //   closed: {
    //     x: "-100vw",
    //     transition: { type: "spring", stiffness: 300, damping: 30 },
    //   },
    // };

  return (
    <motion.svg      
      className="svg bubble"
      onClick={handleClick}
      viewBox="0 0 200 200"
      style={{
        // position: 'absolute',
        left: `${bubble.x/10}px`,
        top: `${bubble.y/10}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        cursor: 'pointer'
      }}      
      initial={{ 
        x: bubble.path[0].x, 
        y: bubble.path[0].y,
        opacity: 0,
        scale: 0
      }}
      animate={controls}
      // animate={{
      //   x: bubble.path.map(p => p.x),
      //   y: bubble.path.map(p => p.y),
      //   opacity: 1,
      //   scale: 1
      // }}
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