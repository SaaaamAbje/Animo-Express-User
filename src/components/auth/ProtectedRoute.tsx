import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from './AuthContext';

export function ProtectedRoute() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#065F46] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
