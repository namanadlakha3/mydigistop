import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-dark-base)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-brand-purple)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-dark-base)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-brand-purple)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
