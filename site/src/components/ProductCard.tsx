import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/shop/${product.id}`} className={styles.card}>
      <img src={product.image} alt={product.imageAlt} className={styles.image} />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
