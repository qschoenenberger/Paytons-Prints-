import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>&copy; {new Date().getFullYear()} Payton&rsquo;s Prints. Custom pen and ink illustrations.</p>
        <Link to="/contact">Request a custom drawing</Link>
      </div>
    </footer>
  );
}
