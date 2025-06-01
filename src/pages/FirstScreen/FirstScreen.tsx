import React from 'react'
import { motion } from 'framer-motion'
import image1 from '../../assets/zvezda-red.png'
import image2 from '../../assets/gerb-sssr.png'
import image3 from '../../assets/golovolomka.png'
import image4 from '../../assets/hobby-fishing.png'
import image5 from '../../assets/serp-i-molot.png'
import image6 from '../../assets/flag-of-china.png'
import image7 from '../../assets/Blueberry.png'
import image8 from '../../assets/Carrot.png'
import image9 from '../../assets/Eggplant.png'
import image10 from '../../assets/Fig.png'
import image11 from '../../assets/Fresh-Blueberry.png'
import image12 from '../../assets/Garlic.png'
import image13 from '../../assets/Guava.png'
import image14 from '../../assets/Lime.png'
import image15 from '../../assets/Mango.png'
import image16 from '../../assets/Onion.png'
import image17 from '../../assets/Orange.png'
import image18 from '../../assets/Paprika.png'
import image19 from '../../assets/Pea.png'
import image20 from '../../assets/Pineapple.png'
import image21 from '../../assets/Radish.png'
import image22 from '../../assets/Tomato.png'
import image23 from '../../assets/Watermelon.png'
import image24 from '../../assets/figa.png'
import styles from './FirstScreen.module.css'

export const ImageStripes: React.FC = () => {
  const images1 = [image1, image2, image3, image4, image5, image6]
  const images2 = [image7, image8, image9, image10, image11, image12]
  const images3 = [image13, image14, image15, image16, image17, image18]
  const images4 = [image19, image20, image21, image22, image23, image24]
  const imgs = [images1, images2, images3, images4]
  const countStrip = [ -1, 1, -1, 1 ]
  const containerHeight = 700
  const imageHeight = 50
  const margin = 3 

  return (
    <div className={styles.imageStripes}>
      {imgs.map((item, i) => (
        <motion.div
        className={styles.stripes}
        style={{ height: `${containerHeight}px` }}      
      >
        {/* Анимация движения */}
        <motion.div
        className={styles.wrapper}
          initial={{ y: countStrip[i] > 0 ? `0px` : `-${item.length * imageHeight * margin }px` }}
          animate={{ y: countStrip[i] > 0 ? `-${item.length * imageHeight * margin }px` : `0px` }}       
          transition={{
            duration: (item.length * imageHeight) / 20, // Скорость анимации
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {/* Оригинальные изображения + их клоны */}
          {[...item, ...item].map((image, index) => (        
            // <div
            //   className={styles.imgPng}           
            //   key={`${i}`.concat(index.toString())}              
            //   style={{backgroundImage: `url(${image})`}}          
            // >{image}</div>
            <motion.img
              key={`${i}`.concat(index.toString())}
              className={styles.imgPng}
              src={image}
              alt={`image-${index}`}
              style={{             
                height: `${imageHeight}px`,              
                top: `${index * imageHeight * margin}px`,
              }}           
            />
          ))}
        </motion.div>
      </motion.div>    
      ))}      
    </div>
  )
}
// анимация числа
// import "./styles.css";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
// import { useEffect } from "react";

// export default function App() {
//   const count = useMotionValue(0);
//   const rounded = useTransform(count, Math.round);

//   useEffect(() => {
//     const animation = animate(count, 50, {
//       duration: 2
//     });
//   }, []);

//   return <motion.h1>{rounded}</motion.h1>;
// }