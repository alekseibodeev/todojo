import Login from './routes/Login';
import Register from './routes/Register';
import Root from './routes/Root';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
