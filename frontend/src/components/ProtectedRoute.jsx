import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';
import PageTransition from './PageTransition.jsx';
import { homePath } from '../utils.js';

// Only lets the right role see the page. Everyone else is redirected.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homePath(user.role)} replace />;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
