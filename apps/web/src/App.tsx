import { brandColors } from '@acme/shared';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

export const App = () => (
  <div style={{ backgroundColor: brandColors.white, color: brandColors.black, minHeight: '100vh' }}>
    <RouterProvider router={router} />
  </div>
);
