import React, { useState, useEffect, useRef } from "react"
// import { dollar, ruble, rupee, euro, pound, yen, yuan, bitcoin } from "./paths"
import { ruble, pound, euro, yen, yuan, rupee, dollar, bitcoin, ttt } from "./paths"
import { motion, useMotionValue, useTransform, animate, useAnimation } from "framer-motion"
import { useFlubber } from "./use-flubber"
// import {interpolate} from 'flubber'
import "./Morph.css"

// const paths = [dollar, ruble, rupee, euro, pound, yen, yuan, bitcoin]
const paths = [ruble, euro, pound, dollar, yen, yuan, bitcoin, rupee, ruble]
const colors = [
  "#00cc88",
  "#0099ff",
  "#8855ff",
  "#00cc88",
  "#ff0055",
  "#ee4444",
  "#ffcc00",
  "#00bb77",
  "#00cc88"
];

export const Morph:React.FC = () => {
   const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  const fill = useTransform(progress, paths.map((_, index: number) => index), colors);
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

// export const Morph: React.FC = () => {
//   const [activePath, setActivePath] = useState(0)
//   // const progress = useMotionValue(activePath);
//   // const fill = useTransform(progress, paths.map(getIndex), colors);

//   // const animatedPath = useFlubber(progress, paths);
//   const path = useMotionValue(paths[activePath])
  
//   React.useEffect(() => {
//     const interval = setInterval(()=> {
//       if (activePath === 0) {
//         // Анимация от первого пути ко второму
//         animate(path, interpolate(paths[0], paths[1], { maxSegmentLength: 0.1 }), {
//           duration: 1,
//         });
//         setActivePath(1);
//       } else {
//         // Анимация от второго пути к первому
//         animate(path, interpolate(paths[1], paths[0], { maxSegmentLength: 0.1 }), {
//           duration: 1,
//         });
//         setActivePath(0);
//       }
//     }, 2000)    
    
//     return () => clearInterval(interval)
//   }, [activePath, path])

//   return (
//     <div style={{paddingTop: '200px'}}>
//       <svg width="200" height="200">
//         <g // transform="translate(10 10) scale(8 8)"
//         >
//           <motion.path
//             d={path}
//             fill="red"
//             // fill={fill}
//             stroke="black"
//             strokeWidth="2"
//           />
//         </g>        
//       </svg>
//     </div>
//   );
// };

// export const Morph: React.FC = () => {
//   const [pathIndex, setPathIndex] = useState(0);
//   const progress = useMotionValue(pathIndex);
//   const loopedPaths = [...paths, paths[0]]
//   const fill = useTransform(progress, paths.map(getIndex), colors);
//   const path = useFlubber(progress, paths)  

//   // // Интерполяция цветов
//   // const fill = useTransform(progress, [0, 1], [
//   //   colors[currentIndex],
//   //   colors[(currentIndex + 1) % colors.length],
//   // ]);

//   // // Интерполяция путей
//   // const path = useTransform(progress, [0, 1], [
//   //   paths[currentIndex],
//   //   paths[(currentIndex + 1) % paths.length],
//   // ]);

//   useEffect(() => {    
//     const animation = animate(progress, pathIndex, {
//       duration: 0.8,
//       ease: "easeInOut",
//       onComplete: async () => {
//         if (pathIndex === paths.length - 1) {
//           // await new Promise(resolve => setTimeout(resolve, 300))
//           // await animate(progress, 0, {
//           //   duration: 0.8, // Продолжительность анимации
//           //   ease: "easeInOut",
//           // });
//           progress.set(0);
//           setPathIndex(0);
//         } else {
//           setPathIndex(pathIndex + 1);
//         }
//         // setPathIndex((prev) => (prev + 1) % paths.length)
//       }      
//     })
//     return () => animation.stop()    
    
//   }, [pathIndex])

//   return (
//     <div style={{ paddingTop: '100px' }}>    
//       <svg width="400" height="400">
//         <g transform="translate(10 10) scale(17 17)">
//           <motion.path fill={fill} d={path} />
//         </g>
//       </svg> 
//     </div>   
//   )
// }

//---------------------------------------------------------
// const paths = [dollar, ruble, rupee, euro, pound, yen, yuan, bitcoin]
// const colors = [
//   "#00cc88",
//   "#0099ff",
//   "#8855ff",
//   "#ff0055",
//   "#ee4444",
//   "#ffcc00",
//   "#00cc88",
//   "#8855ff"
// ]

// export const Morph: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const progress = useMotionValue(0); // Значение для интерполяции

//   // Зацикленный массив путей (добавляем первый элемент в конец)
//   const loopedPaths = [...paths, paths[0]];

//   // Интерполяция цветов
//   const fill = useTransform(progress, [0, 1], [
//     colors[currentIndex],
//     colors[(currentIndex + 1) % colors.length],
//   ]);

//   // Интерполяция путей
//   const path = useTransform(progress, [0, 1], [
//     loopedPaths[currentIndex],
//     loopedPaths[currentIndex + 1],
//   ]);

//   const controls = useAnimation();

//   React.useEffect(() => {
//     const animatePath = async () => {
//       await controls.start({
//         opacity: 1,
//         scale: 1,
//         transition: { duration: 0.8, ease: "easeInOut" },
//       });

//       // Анимация прогресса
//       await animate(progress, 1, {
//         duration: 1,
//         ease: "easeInOut",
//         onComplete: () => {
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % paths.length);
//           progress.set(0); // Сброс прогресса для следующего шага
//         },
//       });
//     }  
//     animatePath();
//   }, [currentIndex]);

//   return (
//     <svg width="400" height="400">
//       <g transform="translate(200 200) scale(10)">
//         {/* Анимированный путь */}
//         <motion.path
//           fill={fill}
//           d={path}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={controls}
//         />
//       </g>
//     </svg>
//   );
// };

// -----------------------[0->1]
// export const Morph: React.FC = () => {
//   const [pathIndex, setPathIndex] = useState(0);
//   const progress = useMotionValue(0); // Progress всегда в диапазоне [0, 1]
//   const fill = useTransform(progress, [0, 1], [colors[pathIndex], colors[(pathIndex + 1) % paths.length]]);
//   const path = useFlubber(progress, [paths[pathIndex], paths[(pathIndex + 1) % paths.length]]);

//   useEffect(() => {
//     const animation = animate(progress, 1, {
//       duration: 4.8,
//       ease: "easeInOut",
//       onComplete: () => {
//         // Переходим к следующему пути
//         setPathIndex((prevIndex) => (prevIndex + 1) % paths.length);
//         progress.set(0); // Сбрасываем progress для следующей анимации
//       },
//     });

//     return () => animation.stop();
//   }, [pathIndex]);