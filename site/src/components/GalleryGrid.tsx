import styles from './GalleryGrid.module.css';

export interface GalleryImage {
  src: string;
  alt: string;
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} className={styles.image} />
      ))}
    </div>
  );
}
