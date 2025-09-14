import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BouncingDotsLoader } from '@baby-toys/ui-kit/components';

interface Props {
  children: JSX.Element;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, hasPermission, isLoading } = useAuth();

  if (isLoading) return <BouncingDotsLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && !hasPermission()) return <Navigate to="/unauthorized" replace />;

  return children;
}
