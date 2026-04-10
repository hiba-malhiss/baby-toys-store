import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps any route that requires admin authentication.
 * - If still initializing → shows a loading screen.
 * - If not authenticated → redirects to /play (with login prompt triggered externally).
 * - If authenticated but not an admin → redirects to /play.
 * - Otherwise → renders children.
 */
export default function ProtectedAdminRoute({ children }: Props) {
  const { isAuthenticated, hasPermission, isInitializing } = useAdminAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-3)',
        fontSize: '15px',
        gap: '10px',
      }}>
        <span style={{ fontSize: '24px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🎮</span>
        Loading…
      </div>
    );
  }

  // Not logged in at all → redirect to player hub
  if (!isAuthenticated) {
    return <Navigate to="/play" replace state={{ from: location }} />;
  }

  // Logged in but not admin → redirect to player hub
  if (!hasPermission()) {
    return <Navigate to="/play" replace />;
  }

  return <>{children}</>;
}
