import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "~/hooks/useAuthRedirect";
import routeConfig from "~/config/routeConfig";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Kiểm tra hạn của token
  useAuthRedirect();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      // Kiểm tra nếu không phải là admin
      if (decodedToken.user_role !== "admin") {
        navigate(routeConfig.adminLogin, { replace: true });
      }
    } else {
      // Nếu không có token, điều hướng đến trang login admin
      navigate(routeConfig.adminLogin, { replace: true });
    }
  }, [token, navigate]);

  return children;
};

export default AdminRoute;
