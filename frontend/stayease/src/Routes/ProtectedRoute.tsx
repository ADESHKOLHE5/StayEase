import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Unauthorized from "../components/Unauthorized";

const ProtectedRoute = ({ children, userRole }) => {
  const { user } = useAuth(); // reads decoded JWT from AuthContext

  // Case 1: No user = not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Case 2: Wrong role → show Unauthorized page (rendered inline, no redirect)
  if (user.role?.toUpperCase() !== userRole?.toUpperCase()) {
    return <Unauthorized />;
  }

  // Case 3: ✅ Logged in + correct role → render the page
  return children;
};

export default ProtectedRoute;