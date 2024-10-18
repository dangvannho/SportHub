import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginAdmin from "~/services/Auth/loginAdmin";
import routeConfig from "~/config/routeConfig";
import "./LoginAdmin.scss";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmitLoginAdmin = async () => {
    const data = await loginAdmin(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    navigate(routeConfig.manageCustomer);
  };

  return (
    <div className="login-admin-wapper">
      <div className="login-admin-container">
        <h4>Admin</h4>

        <div className="form-login">
          <div className="form-group-admin">
            <input
              type="text"
              placeholder="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-admin">
            <input
              type="text"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-login-admin" onClick={handleSubmitLoginAdmin}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
