import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

export default function AuthRedirect() {
  const { isAuthenticated, hasPermission, isInitializing } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while initializing
    if (isInitializing) return;

    // If authenticated and admin, go to admin hub
    if (isAuthenticated && hasPermission()) {
      navigate('/admin', { replace: true });
      return;
    }

    // If authenticated but not admin, go to player hub
    if (isAuthenticated && !hasPermission()) {
      navigate('/play', { replace: true });
      return;
    }

    // If not authenticated, go to player hub by default
    navigate('/play', { replace: true });
  }, [isAuthenticated, hasPermission, isInitializing, navigate]);

  // Show loading while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎮</div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#1f2937'
        }}>
          Games App
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Loading games...
        </p>
      </div>
    </div>
  );
}
