import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import login from "~/services/Auth/login";
import routeConfig from "~/config/routeConfig";
import "./Login.scss";

function Login() {
  const [hidepassword, setShowPassword] = useState(true);
  const [typePassword, setTypePassword] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(AppContext);

  const navigate = useNavigate();

  // validateEmail
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Xử lí đăng nhập
  const handleSubmitLoginUser = async () => {
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

    const res = await login(email, password);
    if (res.EC === 1) {
      localStorage.clear();
      localStorage.setItem("accessToken", res.accessToken);

      const decodedToken = jwtDecode(res.accessToken);

      if (decodedToken.user_role !== "admin") {
        const user = {
          id: res._id,
          name: res.name || res.business_name,
          avatar: res.profile_picture || null,
        };
        localStorage.setItem("user", JSON.stringify(user));
        setUserData(user);
      }

      if (decodedToken.user_role == "admin") {
        navigate(routeConfig.manageCustomer);
      } else {
        navigate(routeConfig.home);
      }
    } else {
      toast.error(res.EM);
    }
  };

  // xử lý sự kiện Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitLoginUser();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <p className="logo">Logo</p>
        <h2 className="title-login">Đăng nhập</h2>
        <div className="form-login">
          <div className="form-group">
            {/* E-mail */}
            <label htmlFor="">E-mail</label>
            <input
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onKeyDown={handleKeyDown}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="">Mật khẩu</label>
            <input
              type={typePassword}
              placeholder="makhau123"
              value={password}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPassword(e.target.value)}
            />
            {hidepassword && (
              <div
                className="eye"
                onClick={() => {
                  setShowPassword(!hidepassword);
                  setTypePassword("text");
                }}
              >
                <IoEyeOutline size={20} />
              </div>
            )}
            {!hidepassword && (
              <div
                className="eye"
                onClick={() => {
                  setShowPassword(!hidepassword);
                  setTypePassword("password");
                }}
              >
                <IoEyeOffOutline size={20} />
              </div>
            )}
          </div>

          <button className="submit-login" onClick={handleSubmitLoginUser}>
            Đăng nhập
          </button>

          <p className="sign-up">
            Bạn chưa có tài khoản?
            <Link to={routeConfig.register}>Tạo tại đây</Link>
          </p>
        </div>
        <p className="back-home" onClick={() => navigate(routeConfig.home)}>
          &lt; &lt; Trở về trang chủ
        </p>
      </div>
    </div>
  );
}

export default Login;
