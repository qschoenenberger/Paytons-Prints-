import wisconsinPrint from '../assets/shop/wisconsin-print.jpg';
import bagelDeliPlaceholder from '../assets/shop/bagel-deli-placeholder.svg';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageAlt: string;
  stripeLink: string;
}

export const products: Product[] = [
  {
    id: 'wisconsin-print',
    name: 'Wisconsin Print',
    price: 20,
    description:
      'A hand-drawn pen and ink illustration inspired by the state of Wisconsin. Printed at 8x10.',
    image: wisconsinPrint,
    imageAlt: 'Pen and ink illustration of Wisconsin',
    // TODO(Quinn): replace with the real Stripe Payment Link for this product
    // (Stripe Dashboard -> Payment Links -> create one for Wisconsin Print, $20).
    stripeLink: 'https://buy.stripe.com/TODO_WISCONSIN_PRINT',
  },
  {
    id: 'bagel-deli-shop-print',
    name: 'Bagel Deli Shop Print',
    price: 15,
    description: 'A hand-drawn pen and ink illustration of a bagel deli storefront.',
    // TODO(Quinn): no product photo exists in this repo yet. Drop the real photo at
    // site/src/assets/shop/bagel-deli-shop-print.jpg and swap the import + fields below.
    image: bagelDeliPlaceholder,
    imageAlt: 'Photo coming soon for the Bagel Deli Shop Print',
    // TODO(Quinn): replace with the real Stripe Payment Link for this product ($15).
    stripeLink: 'https://buy.stripe.com/TODO_BAGEL_DELI_PRINT',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
