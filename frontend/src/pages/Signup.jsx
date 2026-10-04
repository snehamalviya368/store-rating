import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import UserForm from '../components/UserForm.jsx';
import { homePath } from '../utils.js';

export default function Signup() {
  const { user, saveLogin } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to={homePath(user.role)} replace />;

  async function handleSignup(values) {
    const data = await api('/auth/signup', {
      method: 'POST',
      body: {
        name: values.name,
        email: values.email,
        address: values.address,
        password: values.password,
      },
    });
    saveLogin(data);
    navigate(homePath(data.user.role));
  }

  return (
    <AuthLayout title="Create your account" subtitle="It only takes a minute">
      <UserForm onSubmit={handleSignup} buttonText="Create account" />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
