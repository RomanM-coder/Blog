import styles from './Skeleton.module.css'

export const SkeletonListCategory = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
    </div>
  )
}