import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import routeConfig from "~/config/routeConfig";
import "./Login.scss";

function Login() {
  const [hidepassword, setShowPassword] = useState(true);
  const [typePassword, setTypePassword] = useState("password");

  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <p className="logo">Logo</p>
        <h2 className="title-login">Đăng nhập</h2>
        <div className="form-login">
          <div className="form-group">
            <label htmlFor="">E-mail</label>
            <input type="Email" placeholder="example@gmail.com" />
          </div>

          <div className="form-group">
            <label htmlFor="">Mật khẩu</label>
            <input type={typePassword} placeholder="makhau123" />
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

          <button className="submit-login">Đăng nhập</button>

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
