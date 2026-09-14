import GalleryGrid, { type GalleryImage } from '../components/GalleryGrid';
import house from '../assets/gallery/house.jpg';
import wisconsin from '../assets/gallery/wisconsin.jpg';
import corsair from '../assets/gallery/corsair.jpg';
import armyplane from '../assets/gallery/armyplane.jpg';
import kingair from '../assets/gallery/kingair.jpg';
import t6trainer from '../assets/gallery/t6trainer.jpg';
import helmet from '../assets/gallery/helmet.jpg';
import styles from './Gallery.module.css';

const images: GalleryImage[] = [
  { src: house, alt: 'Pen and ink illustration of a house' },
  { src: wisconsin, alt: 'Pen and ink illustration of Wisconsin' },
  { src: corsair, alt: 'Pen and ink illustration of a Corsair airplane' },
  { src: armyplane, alt: 'Pen and ink illustration of an army airplane' },
  { src: kingair, alt: 'Pen and ink illustration of a King Air airplane' },
  { src: t6trainer, alt: 'Pen and ink illustration of a T-6 Trainer airplane' },
  { src: helmet, alt: 'Pen and ink illustration of a helmet' },
];

export default function Gallery() {
  return (
    <div className="container">
      <h1>Gallery</h1>
      <p>A look at past pen and ink commissions and prints.</p>
      <div className={styles.wrap}>
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
