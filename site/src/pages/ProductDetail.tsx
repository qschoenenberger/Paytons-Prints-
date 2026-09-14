import { useParams, Link, Navigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <Link to="/shop" className={styles.back}>
        &larr; Back to Shop
      </Link>
      <div className={styles.layout}>
        <img src={product.image} alt={product.imageAlt} className={styles.image} />
        <div>
          <h1>{product.name}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <a href={product.stripeLink} target="_blank" rel="noopener noreferrer" className={styles.buyButton}>
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
