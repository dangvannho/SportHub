import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import routeConfig from "~/config/routeConfig";

const useAuthRedirect = (role) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate(routeConfig.login, { replace: true });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;

      // Kiểm tra token hết hạn
      if (decodedToken.exp < currentTime) {
        navigate(routeConfig.login, { replace: true });
        return;
      }

      // Kiểm tra role người dùng
      if (decodedToken.user_role !== role) {
        navigate(routeConfig.login, { replace: true });
        return;
      }
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      navigate(routeConfig.login, { replace: true });
    }
  }, [navigate, role]);
};

export default useAuthRedirect;
