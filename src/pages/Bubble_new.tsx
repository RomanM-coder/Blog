import React, { useEffect, useRef, useState } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import {Splash} from './Splash'
import './Bubble.css'

interface BubbleProps {  
  keyId: number
  handleCollapse: (id: number) => void
}

export const Bubble_new: React.FC<BubbleProps> = ({ keyId, handleCollapse }) => {
  const baseShapeSize = 200
  const minShapeSize = 50
  // const shapeSize = Math.round(Math.random() * (baseShapeSize - minShapeSize)) + minShapeSize  
  // const maxX = containerWidth - shapeSize
  // const maxY = containerHeight - shapeSize

    // Позиция пузыря
  const getRandomPosition = (max: number) => Math.random() * max
  const getRandomSize = Math.round(Math.random() * (baseShapeSize - minShapeSize)) + minShapeSize
  // const getRandomSpeed = () => Math.random() * 5 + 3

  // const isMounted = useRef(false)

     // Размеры пузыря
  
  // const [collapseBubble, setCollapseBubble] = useState<number|null>(null)
  // const bubbleRef = useRef<SVGSVGElement | null>(null)
  const controls = useAnimation()
  const controlsSplash = useAnimation()
  const [bubbleSize, setBubbleSize] = useState(getRandomSize)
  const [position, setPosition] = useState({ x: getRandomPosition(window.innerWidth - baseShapeSize), y: getRandomPosition(window.innerHeight - baseShapeSize) })

  const handleClick = async () => {
    // if (!isMounted.current) return
    // setCollapseBubble(keyId)   
    // controls.stop()   
    await controlsSplash.start({ 
      scale: [0, 1.5, 1.2], 
      opacity: [0, 0.7, 0], 
      transition: { duration: 0.1 } })
    await controls.start({ scale: 0, opacity: 0, transition: { duration: 0.05 } })
    // await new Promise((resolve) => setTimeout(resolve, 100))
    // controls.stop()
       
    // await new Promise((resolve) => setTimeout(resolve, 100))   
    // setCollapseBubble(null)
    // await controls.start({ scale: 1, opacity: 1, transition: { duration: 2 }})
    handleCollapse(keyId)
    // controls.stop()
    // controlsSplash.stop() 
  }

  // useEffect(() => {
  //   isMounted.current = true
  //   const animate = async () => {
  //     if (!isMounted.current) return
  //     if (!controls || !controlsSplash) return
  //     const duration = getRandomSpeed()
  //     try {
  //     await controls.start({
  //       x: getRandomPosition(window.innerWidth - bubbleSize),
  //       y: getRandomPosition(window.innerHeight - bubbleSize),
  //       transition: { duration, ease: "linear" }       
  //     })
  //     if (isMounted.current) {
  //       animate() // Рекурсивный вызов для бесконечного движения
  //     }
  //     }
  //     catch(error) {
  //       console.error("Error:", error)
  //     }     
  //   }
  //   animate()

  //   return () => {
  //     isMounted.current = false
  //     controls.stop()
  //   }
  // }, [])
  
  return (
    <>
    <symbol id={`splash${keyId.toString()}`}>
      <Splash/>
    </symbol>
    <motion.svg
      // key='bubble'
      className="svg bubble"
      // onClick={() => {
      //   setCollapseBubble(index)
      // }}
      viewBox="0 0 200 200"
      // ref={bubbleRef}
      // initial={{ scale: 1, opacity: 1 }}
      style={{
        width: `${bubbleSize}px`,
        height: `${bubbleSize}px`,
        // borderRadius: "50%",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // position: "absolute",
        // top: 0,
        // left: 0,
      }}
      animate={controls}
      initial={{ x: position.x, y: position.y }}
      onClick={handleClick}     
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
            {/*  брызги от лопания пузыря */}       
        <motion.use
          key='splash' 
          xlinkHref={`#splash${keyId.toString()}`} 
          // className={(collapseBubble === keyId) ? "bubble__splash active" : "bubble__splash"}
          className="bubble__splash"
          initial={{opacity: 0, scale: 0}}          
          animate={controlsSplash}           
        >
        </motion.use>       
      </g>      
    </motion.svg></>
  )
}