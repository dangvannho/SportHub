import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";
import "./Register.scss";

function Register() {
  const [hidepassword, setShowPassword] = useState(true);
  const [typePassword, setTypePassword] = useState("password");

  const navigate = useNavigate();

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <p className="logo">Logo</p>
        <h2 className="title-register">Đăng kí</h2>
        <div className="form-register">
          <div className="form-group">
            <label htmlFor="">Tên</label>
            <input type="text" placeholder="nguyen van a" />
          </div>
          <div className="form-group">
            <label htmlFor="">E-mail</label>
            <input type="Email" placeholder="example@gmail.com" />
          </div>

          <div className="form-group">
            <label htmlFor="">Mật khẩu</label>
            <input type={typePassword} placeholder="password123" />
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

          <button className="submit-register">Đăng kí</button>
        </div>

        <p className="back-home" onClick={() => navigate(routeConfig.home)}>
          &lt; &lt; Trở về trang chủ
        </p>
      </div>
    </div>
  );
}

export default Register;
