import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import routeConfig from "~/config/routeConfig";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Nếu token đã hết hạn, điều hướng đến trang đăng nhập tương ứng
        if (decodedToken.user_role === "admin") {
          navigate(routeConfig.adminLogin, { replace: true });
          // } else if (decodedToken.user_role === 'owner') {
          //   navigate(routeConfig.ownerLogin, { replace: true });
        } else {
          navigate(routeConfig.login, { replace: true });
        }
      }
    }
  }, [navigate]);
};

export default useAuthRedirect;
