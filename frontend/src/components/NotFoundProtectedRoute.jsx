import { Navigate } from "react-router-dom";

function NotFoundProtectedRoute() {
  return <Navigate to="/" />;
}

export default NotFoundProtectedRoute;
