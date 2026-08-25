import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './routes/app-layout';
import { CheckoutPage } from './routes/checkout-page';
import { ContactPage } from './routes/contact-page';
import { HomePage } from './routes/home-page';
import { ProductPage } from './routes/product-page';
import { ShopPage } from './routes/shop-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'products/:productId', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'contact', element: <ContactPage /> }
    ]
  }
]);
