import React, { useState, useEffect } from "react"
import {Bubble_new} from "./Bubble_new"

export const AppBubble: React.FC = () => {
  // const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  // const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const maxBubbles = 5;
  const [bubbles, setBubbles] = useState<number[]>(Array.from({ length: maxBubbles }, (_, i) => i))

  const handleCollapse = (id: number) => {
    setBubbles((prev) => {
      const newBuble = prev.filter((bubbleId) => (bubbleId !== id ))
      return [...newBuble, Date.now()]
  })
    // setBubbles((prev) => prev.map((bubbleId) => (bubbleId === id ? Date.now() : bubbleId)))
    // setBubbles([...bubbles, Date.now()])
  }

  // useEffect(() => {
    
  // }, [setBubbles])

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
            <Bubble_new 
              key={bubble} 
              keyId={bubble}
              handleCollapse={handleCollapse}
            />
          ))}
        </div>
      </div>
    </div>
  )
}