import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children, role }) {
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}
