import Root from './routes/Root';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
