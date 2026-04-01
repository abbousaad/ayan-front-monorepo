import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './routes/app-layout';
import { CheckoutPage } from './routes/checkout-page';
import { HomePage } from './routes/home-page';
import { ProductsPage } from './routes/products-page';
import { StoreProductsPage } from './routes/store-products-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'stores/:storeId/products',
        element: <StoreProductsPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      }
    ]
  }
]);
