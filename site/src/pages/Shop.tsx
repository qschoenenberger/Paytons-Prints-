import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';

export default function Shop() {
  return (
    <div className="container">
      <h1>Shop Prints</h1>
      <p className={styles.intro}>Hand-drawn pen and ink illustrations, printed and ready to frame.</p>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
