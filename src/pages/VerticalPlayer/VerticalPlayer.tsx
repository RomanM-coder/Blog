import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import './VerticalPlayer.css'

const gradient = (mask: boolean) =>
  `conic-gradient(black 0%, black ${mask ? 0 : 100}%, transparent ${
    mask ? 0 : 100
  }%, transparent 100%)`;

function Image({ id }: { id: string }) {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: [
      [0, 0.75],
      [0.5, 0.6]
    ]
  });
  const smoothed = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 400,
    restDelta: 0.001
  });
  const maskImage = useTransform(
    smoothed,
    [0, 1],
    [gradient(true), gradient(false)]
  );

  return (
    <section>
      <motion.div
        ref={target}
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >        
        <img src={`/src/assets/${id}.png`} alt="" />
      </motion.div>
    </section>
  );
}

export const VertImg:React.FC = () => {
  return (
    <>
      {['Blueberry', 'Lime', 'Guava', 'Orange', 'Tomato'].map((image, id) => (
        <Image id={image} key={id} />
      ))}
    </>
  );
}