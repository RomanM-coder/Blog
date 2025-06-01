import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Bubble.css";

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  vx: number; // Скорость по оси X
  vy: number; // Скорость по оси Y
}

export const BubbleComponent: React.FC = () => {
  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min
  const navbarFooterHeight = 120  

  const createBubble = (): Bubble => {

    const size = getRandom(50, 200)
    const halfSize = size/2
    const x = getRandom(halfSize, window.innerWidth - halfSize)
    const y = getRandom(halfSize, window.innerHeight - halfSize - navbarFooterHeight)

    console.log('x=', x, '  y=', y)
    
    return {
    id: Math.random().toString(36).substring(2, 9),
    x: x,
    y: y,
    size: size,
    vx: getRandom(-2, 2), // Случайная скорость по X
    vy: getRandom(-2, 2), // Случайная скорость по Y
  }}

  

  const [bubbles, setBubbles] = useState<Bubble[]>(() => Array.from({ length: 5 }, createBubble));

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
            <BubbleItem key={bubble.id} bubble={bubble} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Отдельный компонент для пузыря
const BubbleItem: React.FC<{ bubble: Bubble }> = ({ bubble }) => {
  const controls = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const moveBubble = async () => {
      while (isMounted.current) {
        // Обновляем позицию пузыря
        let newX = bubble.x + bubble.vx;
        let newY = bubble.y + bubble.vy;
        const halfSize = bubble.size / 2
        const navbarFooterHeight = 120

          // Проверяем столкновения с границами экрана
        // if (newX - halfSize <= 0 || newX + halfSize >= window.innerWidth) {
        //   bubble.vx = -bubble.vx; // Инвертируем скорость по X
        // }
        // if (newY - halfSize <= 0 || newY + halfSize >= window.innerHeight) {
        //   bubble.vy = -bubble.vy; // Инвертируем скорость по Y
        // }

        if ((newX - halfSize) < 0) {
          newX = halfSize
          bubble.vx = Math.abs(bubble.vx) // Отражение от левой границы
          bubble.x = newX;
        } else if ((newX + halfSize) > window.innerWidth) {
          newX = (window.innerWidth - halfSize)
          bubble.vx = -Math.abs(bubble.vx) // Отражение от правой границы
          bubble.x = newX;
        }

        if ((newY - halfSize) < 0) {
          newY = halfSize
          bubble.vy = Math.abs(bubble.vy) // Отражение от верхней границы 
          bubble.y = newY;         
        } else if ((newY + halfSize) > window.innerHeight - navbarFooterHeight) {
          newY = (window.innerHeight - halfSize)
          bubble.vy = -Math.abs(bubble.vy) // Отражение от нижней границы
          bubble.y = newY;
        }

        // Обновляем координаты пузыря
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        // console.log(bubble.id,'.x=', bubble.x, ' ', bubble.id,'.y=', bubble.y)
        // Запускаем анимацию движения
        await controls.start({
          x: bubble.x,
          y: bubble.y,
          opacity: 1,
          scale: 1,
          transition: { duration: 0.016 }, // ~60 FPS
        });
      }
    };

    moveBubble();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <motion.svg
      className="svg bubble"
      viewBox="0 0 200 200"
      style={{
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        cursor: "pointer",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={controls}
    >
      <g>
        {/* Блики */}
        <ellipse
          rx="20%"
          ry="10%"
          cx="150"
          cy="150"
          fill="url(#grad--spot)"
          transform="rotate(-225, 150, 150)"
          className="shape _hidden"
        />
        <ellipse
          rx="55"
          ry="25"
          cx="55"
          cy="55"
          fill="url(#grad--spot)"
          transform="rotate(-45, 55, 55)"
          className="shape _hidden"
        />
        {/* Круг с градиентом */}
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          fill="url(#grad)"
          mask="url(#mask)"
          className="shape _hidden"
        />
        {/* Круг с цветом aqua */}
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          fill="aqua"
          mask="url(#mask--light-bottom)"
          className="shape _hidden"
        />
        {/* Круг с цветом yellow */}
        <circle
          r="50%"
          cx="50%"
          cy="50%"
          fill="yellow"
          mask="url(#mask--light-top)"
          className="shape _hidden"
        />
        {/* Брызги */}
        <motion.use
          xlinkHref="#splash"
          className="bubble__splash"
          initial={{ opacity: 0, scale: 0 }}
        />
      </g>
    </motion.svg>
  );
};