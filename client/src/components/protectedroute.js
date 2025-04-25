import { Navigate } from "react-router-dom";

// This component wraps around protected routes
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/auth" />;
  }
  // If the user is logged in, render the protected route
  return children;
};

export default ProtectedRoute;