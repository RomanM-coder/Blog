import styles from './LearnBubble.module.css'

export const LearnBubble = () => {




  return (
    <div className={styles.gradientWrapper}
    >
      {/* <svg className={styles.svg}>
        
        <linearGradient id="linear-gradient">
        <stop offset="0%" stop-color="gold"/>
        <stop offset="100%" stop-color="teal"/>
        </linearGradient>
         
        <rect fill="url(#linear-gradient)"
          width="100%" height="100%"/>
      </svg> */}      

      {/* <svg viewBox="0 0 830 180">
          <linearGradient id="gradient">
              <stop offset="0" stopColor="gold"></stop>
              <stop offset="30%" stopColor="red"></stop>
              <stop offset="60%" stopColor="darkviolet"></stop>
              <stop offset="100%" stopColor="deepskyblue"></stop>
          </linearGradient> */}

          {/* <rect fill="url(#gradient)"
          width="100%" height="100%"/> */}
          
          {/* <symbol id="text">
            <text x="50%" y="50%"
                  dy=".35em"
                  textAnchor="middle"
            >&bull; Gradient &bull;</text>
          </symbol>
          <use xlinkHref="#text"
              fill="transparent"
              stroke="none">
          </use>
          
          <mask id="mask-top">
            <rect width="100%" height="50%"
                  x="0" y="0%"
                  fill="white"></rect>
          </mask>
          
          <mask id="mask-bottom">
              <rect width="96%" height="96%"
                    x="2%" y="2%"
                    rx="20"
                    fill="white" stroke="#999"
                    strokeWidth="5"></rect>
              <rect width="100%" height="50%"
                    x="0" y="0%"
                    fill="black"></rect>
              <use xlinkHref="#text"
                  stroke="none"></use>
          </mask>
          
          <g fill="url(#gradient)"
            stroke="url(#gradient)" 
            strokeWidth="5">
              <g mask="url(#mask-top)">
                  <rect width="96%" height="96%"
                    x="2%" y="2%"
                    rx="20"
                    fill="none"></rect>
                  <use xlinkHref="#text"
                      fill="none" strokeWidth="2"></use>
              </g>
              <g mask="url(#mask-bottom)">
                  <rect width="96%" height="96%"
                    x="2%" y="2%"
                    rx="20"></rect>
              </g>
          </g>
          <use xlinkHref="#text"
              fill="transparent"
              stroke="none">
          </use>          
      </svg>*/}
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
        <div className="demo__defs hidden">    
          <svg className="svg bubble" viewBox="0 0 200 200">
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
              <use xlinkHref="#splash" className="bubble__splash"/>        
            </g>
          </svg> 
      </div>      
    </div> 
  )
}