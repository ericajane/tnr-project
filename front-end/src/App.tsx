import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Volunteers from './pages/Volunteers';
import CatAndColonyData from './pages/CatAndColonyData';
import VeterinaryAppointments from './pages/VeterinaryAppointments';
import FinanceFundraising from './pages/FinanceFundraising';
import Equipment from './pages/Equipment';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'volunteers', element: <Volunteers /> },
      { path: 'cat-colony', element: <CatAndColonyData /> },
      { path: 'veterinary', element: <VeterinaryAppointments /> },
      { path: 'finance', element: <FinanceFundraising /> },
      { path: 'equipment', element: <Equipment /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
