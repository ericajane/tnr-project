import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Volunteers from './pages/Volunteers';
import Caretakers from './pages/Caretakers';
import CatAndColonyData from './pages/CatAndColonyData';
import VeterinaryAppointments from './pages/VeterinaryAppointments';
import FinanceFundraising from './pages/FinanceFundraising';
import Equipment from './pages/Equipment';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'volunteers', element: <Volunteers /> },
      { path: 'caretakers', element: <Caretakers /> },
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
