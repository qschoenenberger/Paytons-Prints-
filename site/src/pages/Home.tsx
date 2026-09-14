import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import logo from '../assets/logo.png';
import styles from './Home.module.css';

export default function Home() {
  const featured = products[0];

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <img src={logo} alt="Payton's Prints" className={styles.logo} />
          <p className={styles.tagline}>Custom pen &amp; ink illustrations, printed for your walls.</p>
          <div className={styles.actions}>
            <Link to="/shop" className={styles.primaryButton}>
              Shop Prints
            </Link>
            <Link to="/contact" className={styles.secondaryButton}>
              Request a Custom Drawing
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <h2>Featured Print</h2>
        <div className={styles.featuredGrid}>
          <ProductCard product={featured} />
        </div>
      </section>

      <section className={`container ${styles.about}`}>
        <h2>Hand-drawn, one line at a time</h2>
        <p>
          Every Payton&rsquo;s Prints illustration starts as pen on paper &mdash; homes, favorite places,
          and keepsakes turned into detailed line art you can hang on your wall.
        </p>
        <p>
          <Link to="/gallery">See more of the gallery &rarr;</Link>
        </p>
      </section>
    </>
  );
}
