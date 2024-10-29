import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";

import "./Register.scss";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="register-wrapper">
      <button
        className="btn-selection"
        onClick={() => navigate(routeConfig.registerUser)}
      >
        Đăng kí cho người dùng
      </button>
      <button
        className="btn-selection"
        onClick={() => navigate(routeConfig.registerOwner)}
      >
        Đăng kí cho chủ sân
      </button>
    </div>
  );
}

export default Register;
