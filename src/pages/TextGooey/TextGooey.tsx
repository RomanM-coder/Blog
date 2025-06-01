import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, animate } from 'framer-motion';
import styles from './TextGooey.module.css'

const numbers = [  
   "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
   "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8",
   "M74.8,178.5c3,39.4,63.9,46.7,88.6,23.7c34.3-35.1,5.4-75.8-41.7-77c29.9,5.5,68.7-43.1,36.5-73.7 c-23.4-21.5-76.5-11.1-78.6,25",
  // "M161.9,220.8 161.9,41 72.6,170.9 190,170.9",
  // "M183.2,43.7H92.1l-10,88.3c0,0,18.3-21.9,51-21.9s49.4,32.6,49.4,48.2c0,22.2-9.5,57-52.5,57s-51.4-36.7-51.4-36.7",  
  // "M72,168 C55,50 140,25 184,65 M72,168 A56,56 0 1,1 184,168 A56,56 0 1,1 72,168",
  // "M80 40 L176 40 L112 232",    
  // "M178.8,71.7 a46.3,46.3,0,0,1-14.9,33.7 a53.3,53.3,0,0,1-71.8,0 a45.6,45.6,0,0,1,0-67.4 a53,53,0,0,1,71.8,0 A46,46,0,0,1,178.8,71.7Z M188,175.7 a54.4,54.4,0,0,1-17.6,39.8 a62.7,62.7,0,0,1-84.8,0 a53.9,53.9,0,0,1,0-79.7 a62.7,62.7,0,0,1,84.8,0 A54.4,54.4,0,0,1,188,175.7Z",  
  // "M184,88 C201,206 116,231 72,191 M184,88 A56,56 0 1,1 72,88 A56,56 0 1,1 184,88"

  //"M72,168 C60,50 135,20 184,55 M72,168 A56,56 0 1,1 184,168 A56,56 0 1,1 72,168",
  // "M79.5,140 L144,32 M72,168 A56,56 0 1,1 184,168 A56,56 0 1,1 72,168",
]

// export const TextGooey: React.FC = () => {

//   const [index, setIndex] = useState(0)
//   // const circles = useRef<SVGCircleElement[][]>([])
//   const circles = useRef<SVGCircleElement[]>([])
//   const paths = useRef<SVGPathElement[]>([])
//   const nbOfCircles = 45
//   const radius = 10
//   console.log('circles=', circles)  

//   useEffect( () => {
//     // if (!circles.current[index]) {
//     //   circles.current[index] = []
//     // }
//     const length = paths.current[index].getTotalLength()
//     const step = length / nbOfCircles

//     circles.current.forEach((circle, i) => {
//       // if (circle) {
//         const { x, y } = paths.current[index].getPointAtLength(i * step)
//         console.log('x=', x, 'y=', y, 'index=', index)      
//         animate(circle, 
//           { cx: x, cy: y }, 
//           { delay: i * 0.025, ease: "easeOut"}
//         )
//       // }
//     })
//   }, [index])

//   useEffect(() => {
//     const interval = setInterval(() => {      
//       setIndex((prev) => {        
//         if (prev === numbers.length - 1) {
//           return 0
//         } else return prev + 1
//       })
//       //setIndex((prev) => (prev + 1) % numbers.length); // Зацикливание индекса
//     }, 2000)

//     return () => {
//       if (interval) clearInterval(interval)     
//     } 
//   }, [])

//   return (
//     <main className={styles.main}> 
//       <div className={styles.numbers}>
//         {numbers.map((_, i) => {
//           return <p 
//             style={{color: i == index ? "red" : "black"}} 
//             // onClick={() => {setIndex(i)}}
//             key={`color${i}`}
//             >{i + 1}</p>
//         })}
//       </div>
//       {/* <div>
//         {numbers.map((path, i) => {
//           return ( */}
//             <svg viewBox="0 0 256 256" 
//             // key={`svg_${i}`}
//               style={{
//                   // visibility: i <= index ? "visible" : "hidden", // Показываем только активные SVG
//                   // transform: `translateX(${i * 400}px)`,
//                 }}
//             >
//               <defs>
//                 <filter id="filter">
//                   <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
//                   <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15" result="filter" />
//                 </filter>
//               </defs>
//               <g>
//                 <path 
//                   // key={`p_${i}`} 
//                   ref={ref => {if (ref) paths.current[index] = ref}} 
//                   // d={path}
//                   d={numbers[index]}
//                   />                
//               </g>

//               <g>
//                 {[...Array(nbOfCircles)].map( (_, i) => {
//                   return <circle 
//                     key={`circle_${i}`} 
//                     ref={(ref) => {
//                       // if (ref && index !== undefined && i !== undefined) {
//                       if (ref ) {
//                         // if (!circles.current[index]) {
//                         //   circles.current[index] = []
//                         // }
//                         circles.current[i] = ref
//                       }
//                     }}
//                     // cx="128" cy="128" 
//                     r={radius} />
//                 })}
//               </g>
//             </svg>
//           {/* )
//       })}
//       </div> */}
//       {/* <svg viewBox="0 0 256 256">
//         <defs>
//           <filter id="filter">
//             <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
//             <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15" result="filter" />
//           </filter>
//         </defs>
//         <g>
//           {numbers.map((path, i) => {
//             return <path 
//               key={`p_${i}`} 
//               ref={ref => {
//                 if (ref) paths.current[i] = ref                  
//               }} 
//               d={path}/>
//           })}
//         </g>

//         <g>
//           {[...Array(nbOfCircles)].map( (_, i) => {
//             return <circle 
//               key={`c_${i}`} 
//               ref={ref => {if (ref) circles.current[i] = ref}} 
//               cx="128" cy="128" r={radius} />
//           })}
//         </g>
//       </svg>      */}
//     </main>
//   )
// }

export const TextGooey: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Индекс активного пути
  // const paths = useRef<SVGPathElement[]>([]);
  const nbOfCircles = 30;
  const radius = 15;

  // Состояние для управления анимацией цифр
  const [animatedDigits, setAnimatedDigits] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Добавляем следующую цифру в массив анимированных цифр
      setAnimatedDigits((prev) => {
        if (prev.length === numbers.length) {
          // Если все цифры показаны, начинаем заново
          setActiveIndex(0);
          return [];
        }
        const nextDigit = prev.length;
        setActiveIndex(nextDigit);
        return [...prev, nextDigit];
      });
    }, 2000); // Каждые 2 секунды добавляем новую цифру

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      {/* Левая часть: Номера путей */}
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

      {/* Правая часть: Анимация цифр */}
      <div className={styles.animationContainer}>
        {animatedDigits.map((digitIndex, i) => (
          <AnimatedDigit
            key={`digit-${digitIndex}`}
            path={numbers[digitIndex]}
            index={digitIndex}
            nbOfCircles={nbOfCircles}
            radius={radius}
            xOffset={i * 400} // Отступ по горизонтали
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
  xOffset: number;
}> = ({ path, index, nbOfCircles, radius, xOffset }) => {

  // console.log(`Filter ID: filter-${index}`)
  const circles = useRef<SVGCircleElement[]>([]);
  const pathRef = useRef<SVGPathElement | null>(null);
  // const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false); // Флаг для отслеживания анимации

  useEffect(() => {
    if (!pathRef.current) return;

    // const length = pathRef.current.getTotalLength();
    // const step = length / nbOfCircles;

    // circles.current.forEach((circle, i) => {
    //   const { x, y } = pathRef.current!.getPointAtLength(i * step);

    //    controls.start({
    //     cx: x + xOffset,
    //     cy: y,
    //     transition: { delay: i * 0.025, ease: "easeOut" }
    //   });
    // //   animate(circle, 
    // //     { cx: x + xOffset, cy: y }, 
    // //     { delay: i * 0.025, ease: "easeOut"}
    // //   )
    // });
    const animateCircles = async () => {
       if (!pathRef.current || isAnimating) return
       setIsAnimating(true); // Устанавливаем флаг анимации

      const length = pathRef.current!.getTotalLength()
      const step = length / nbOfCircles

      for (let i = 0; i < nbOfCircles; i++) {
        const circle = circles.current[i];
        if (!circle) continue;

        const { x, y } = pathRef.current!.getPointAtLength(i * step);
        // await controls.start({
        //   cx: x + xOffset,
        //   cy: y,
        //   transition: { delay: i * 0.025, ease: "easeOut" }
        // });
        animate(circle, 
          { cx: x, cy: y }, 
          { delay: i * 0.025, ease: "easeOut"}
        )   
      }
      setIsAnimating(false); // Снимаем флаг анимации
    }

    animateCircles()
  }, [index]);

  return (
    <svg
      viewBox="0 0 256 256"
      style={{ 
        position: "absolute", 
        left: `${xOffset}px`,
        top: '100px', 
        filter: `url(#filter-${index})` }}
    >
      <defs>
        <filter id={`filter-${index}`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
            result="filter"
          />          
        </filter>
      </defs>
      <g>
        <path
          ref={(ref) => (pathRef.current = ref)}
          d={path}
        />
      </g>
      <g>
        {[...Array(nbOfCircles)].map((_, i) => (         
          <circle
            key={`circle-${i}`}
            ref={(ref) => { if (ref) circles.current[i] = ref }}
            cx="128" cy="128"
            r={radius}                     
          />
        ))}
      </g>
    </svg>
  );
};



// export const TextGooey:React.FC = () => {
//   const pathRef = useRef<SVGPathElement | null>(null);
//   const circles = useRef<SVGCircleElement[]>([]);
//   const nbOfCircles = 45;
//   const radius = 10;

//   useEffect(() => {
//     if (!pathRef.current) return;

//     const length = pathRef.current!.getTotalLength();
//     console.log('Path length:', pathRef.current!.getTotalLength())
//     const step = length / nbOfCircles;

//     circles.current.forEach((circle, i) => {
//       if (!circle) return;

//       const { x, y } = pathRef.current!.getPointAtLength(i * step);
//       animate(circle, 
//         { cx: x, cy: y }, 
//         { delay: i * 0.025, ease: "easeOut" }
//       );
//     });
//   }, []);

//   return (
//      <main className={styles.main}>
//     <svg viewBox="0 0 256 256" style={{ filter: 'url(#filter)' }}
//     >
//       <defs>
//         <filter id="filter">
//           <feGaussianBlur in="SourceAlpha" stdDeviation={`${radius}`} result="blur" />
//           <feColorMatrix in="blur" mode="matrix"
//              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
//              result="filter"
//            />
//          </filter>
//        </defs>
//        <g>
//       <path ref={(ref) => (pathRef.current = ref)} d={numbers[0]} />
//         </g>
//       {/* <path d={numbers[0]} stroke="black" fill="none" /> */}
//       <g>
//         {[...Array(nbOfCircles)].map((_, i) => (
//           <circle
//             key={`circle-${i}`}
//             ref={(ref) => { if (ref) circles.current[i] = ref }}
//             cx="128" cy="128" r={radius} 
//           />
//         ))}
//       </g>
//     </svg>
//     </main>
//   );
// };
