import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.windowsFooter}>
      <div className={styles.footerContent}>
        <div className={styles.statusBar}>
          <span className={styles.statusItem}>Pronto</span>
          {/* <span className={styles.statusItem}>Test</span> */}
        </div>
        <small className={styles.copyright}>
          © {new Date().getFullYear()} Meu App - Caio
        </small>
      </div>
    </footer>
  );
}