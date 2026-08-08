import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './routes/app-layout';
import { CategoryPage } from './routes/category-page';
import { CheckoutPage } from './routes/checkout-page';
import { HomePage } from './routes/home-page';
import { ProductPage } from './routes/product-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:storeId', element: <CategoryPage /> },
      { path: 'products/:productId', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> }
    ]
  }
]);
