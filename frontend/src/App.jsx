import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import LoginCard from './components/LoginCard';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Toaster position="top-center" />
      {user ? <Dashboard /> : <LoginCard />}
    </>
  );
}
