import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={`container ${styles.wrap}`}>
      <h1>About Payton</h1>
      <p>
        Payton&rsquo;s Prints started with sketching homes for friends and family as gifts, and grew
        into a small custom illustration business based in Wisconsin. Every piece is drawn by hand in
        pen and ink before it&rsquo;s printed &mdash; from favorite homes and travel landmarks to
        keepsakes and special-occasion commissions.
      </p>
      <p>
        Want something drawn for you? Head over to the <Link to="/contact">Contact page</Link> to
        start a custom order.
      </p>
    </div>
  );
}
