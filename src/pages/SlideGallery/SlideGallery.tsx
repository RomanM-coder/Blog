import styles from './style.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

const anim = {
    initial: {width: 0},
    open: {width: "auto", transition: {duration: 0.4, ease: [0.23, 1, 0.32, 1]}},
    closed: {width: 0}
}

export default function index({project}) {

    const [isActive, setIsActive] = useState(false);

    const { title1, title2, src } = project;
    return (
        <div onMouseEnter={() => {setIsActive(true)}} onMouseLeave={() => {setIsActive(false)}} className={styles.project}>
            <p>{title1}</p>
            <motion.div variants={anim} animate={isActive ? "open" : "closed"} className={styles.imgContainer}>
                <img src={`/medias/${src}`}></img>
            </motion.div>
            <p>{title2}</p>
        </div>
    )
}
//----------------------------------------

import styles from './page.module.css'
import Project from '../components/project';

export default function Home() {

  const projects = [
    {
      title1: "Jomor",
      title2: "Design",
      src: "jomor_design.jpeg"
    },
    {
      title1: "La",
      title2: "Grange",
      src: "la_grange.jpeg"
    },
    {
      title1: "Deux Huit",
      title2: "Huit",
      src: "deux_huit_huit.jpeg"
    },
    {
      title1: "Nothing",
      title2: "Design Studio",
      src: "nothing_design_studio.png"
    },
    {
      title1: "Mambo",
      title2: "Mambo",
      src: "mambo_mambo.jpeg"
    }
  ]

  return (
    <main className={styles.main}>
      <div className={styles.gallery}>
        <p>Featured Work</p>
          {
            projects.map( project => {
              return <Project project={project}/>
            })
          }
      </div>
    </main>
  )
}

.main {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .gallery{
    width: 70%;
  }