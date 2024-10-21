import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import loginAdmin from "~/services/Auth/loginAdmin";
import routeConfig from "~/config/routeConfig";
import "./LoginAdmin.scss";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // validateEmail
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitLoginAdmin = async () => {
    // Kiểm tra định dạng email
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      toast.error("Invalid email!");
      return;
    }

    if (!password) {
      toast.error("Invalid password!");
      return;
    }

    const res = await loginAdmin(email, password);

    if (res.EC === 1) {
      localStorage.clear();

      localStorage.setItem("accessToken", res.accessToken);
      navigate(routeConfig.manageCustomer);
    } else {
      toast.error(res.EM);
    }
  };

  // xử lý sự kiện Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitLoginAdmin();
    }
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
              onKeyDown={handleKeyDown}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-admin">
            <input
              type="password"
              placeholder="Enter Password..."
              value={password}
              onKeyDown={handleKeyDown}
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
