import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const roleName = user?.role?.name;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner className="w-10 h-10 border-emerald-500 border-t-transparent" />
        <p className="mt-4 text-emerald-600 font-medium animate-pulse">
          Đang xác thực quyền truy cập...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
