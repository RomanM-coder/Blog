import styles from './Footer.module.css'

export const Footer = (year: {year: Number}) => {
  return (
    <footer className="blue darken-4">
      <span className={styles.btn}>© React Blog - {year.toString()}</span>
    </footer>
  );
}