import React, { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const RotateText:React.FC  = () => {
  const controls = useAnimation();
  const textRef = useRef<SVGTextElement>(null);
  // const [isRotated, setIsRotated] = React.useState(false);

  const handleClick = async () => {
    
      // Анимация поворота и прозрачности
    await controls.start({
      rotateX: [0, 324, 360], // 324 = 90% от 360, затем завершение до 360
      opacity: [0, 0.05, 1], 
      transition: {
        duration: 1, // Общая длительность анимации
        // ease: [0.6, -0.05, 0.735, 0.045], // Кастомная easing-функция для эффекта overshoot
        ease: "easeOutBack",//"easeInOut",//[0.6, -0.2, 0.7, 0.1],
        times: [0, 0.9, 1], // Управление временем ключевых точек
      },
    });
    // setIsRotated(!isRotated)    
  };

  // Получаем реальные размеры текста
  const getTextBox = () => {
    if (textRef.current) {
      return textRef.current.getBBox();
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  const { x, y, width, height } = getTextBox();
  const centerY = y + height / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}>
      <svg width="100%" height="120" viewBox="0 0 400 120">
        {/* Горизонтальная линия через центр текста */}
        <line 
          x1="0" 
          y1={centerY} 
          x2="400" 
          y2={centerY} 
          stroke="red" 
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Текст с анимацией */}
        <motion.text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="50"
          fontFamily="Arial"
          animate={controls}
          style={{
            transformOrigin: `center ${centerY}px`,
            transformBox: 'fill-box'
          }}
        >
          ВРАЩАЮЩИЙСЯ ТЕКСТ
        </motion.text>
      </svg>

      <button 
        onClick={handleClick}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
       Повернуть
      </button>
    </div>
  );
}