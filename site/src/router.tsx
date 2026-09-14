import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'shop', element: <Shop /> },
        { path: 'shop/:productId', element: <ProductDetail /> },
        { path: 'gallery', element: <Gallery /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
