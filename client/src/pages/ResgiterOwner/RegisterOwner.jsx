import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import routeConfig from "~/config/routeConfig";
import registerOwner from "~/services/Auth/registerOwner";
import "../RegisterUser/RegisterUser.scss";

function RegisterOwner() {
  const [hidePassword, setHidePassword] = useState(true);
  const [typePassword, setTypePassword] = useState("password");

  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // validateEmail
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegisterOwner = async () => {
    const trimBusinessName = businessName.trim();
    const trimAdress = address.trim();
    const trimPhoneNumber = phoneNumber.trim();
    const trimEmail = email.trim();

    if (!trimBusinessName || /\d/.test(trimBusinessName)) {
      toast.error("Invalid name!");
      return;
    }

    if (!trimAdress) {
      toast.error("Invalid adrress!");
      return;
    }

    if (
      trimPhoneNumber.length !== 10 ||
      /\s/.test(trimPhoneNumber) ||
      /[a-zA-Z]/.test(trimPhoneNumber)
    ) {
      toast.error("Invalid phone number!");
      return;
    }

    const isValidEmail = validateEmail(trimEmail);
    if (!isValidEmail) {
      toast.error("Invalid email!");
      return;
    }

    if (!password) {
      toast.error("Invalid password!");
      return;
    }

    if (!confirmPassword) {
      toast.error("Invalid confirm password!");
      return;
    }

    // // call api
    const res = await registerOwner(
      trimBusinessName,
      trimAdress,
      trimPhoneNumber,
      trimEmail,
      password,
      confirmPassword
    );
    if (res.EC === 1) {
      toast.success(res.EM);
      navigate(routeConfig.login);
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <div className="register-user-wrapper">
      <div className="register-user-container">
        <p className="logo">Logo</p>
        <h2 className="title-register">Đăng kí</h2>
        <div className="form-register">
          <div className="form-group">
            {/* name */}
            <label htmlFor="">Tên chủ sân</label>
            <input
              type="text"
              placeholder="nguyen van a"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="">Địa chỉ</label>
            <input
              type="text"
              placeholder="123 Khuc Hao"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Phone number */}
          <div className="form-group">
            <label htmlFor="">Số điện thoại</label>
            <input
              type="text"
              placeholder="090531361"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* E-mail */}
          <div className="form-group">
            <label htmlFor="">E-mail</label>
            <input
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="">Mật khẩu</label>
            <input
              type={typePassword}
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {hidePassword && (
              <div
                className="eye"
                onClick={() => {
                  setHidePassword(!hidePassword);
                  setTypePassword("text");
                }}
              >
                <IoEyeOutline size={20} />
              </div>
            )}
            {!hidePassword && (
              <div
                className="eye"
                onClick={() => {
                  setHidePassword(!hidePassword);
                  setTypePassword("password");
                }}
              >
                <IoEyeOffOutline size={20} />
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label htmlFor="">Nhập lại mật khẩu</label>
            <input
              type={typeConfirmPassword}
              placeholder="password123"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {hideConfirmPassword && (
              <div
                className="eye"
                onClick={() => {
                  setHideConfirmPassword(!hideConfirmPassword);
                  setTypeConfirmPassword("text");
                }}
              >
                <IoEyeOutline size={20} />
              </div>
            )}
            {!hideConfirmPassword && (
              <div
                className="eye"
                onClick={() => {
                  setHideConfirmPassword(!hideConfirmPassword);
                  setTypeConfirmPassword("password");
                }}
              >
                <IoEyeOffOutline size={20} />
              </div>
            )}
          </div>

          <button className="submit-register" onClick={handleRegisterOwner}>
            Đăng kí
          </button>

          <p className="sign-in">
            Bạn đã có tài khoản?
            <Link to={routeConfig.login}>Đăng nhập tại đây</Link>
          </p>
        </div>

        <p className="back-home" onClick={() => navigate(routeConfig.home)}>
          &lt; &lt; Trở về trang chủ
        </p>
      </div>
    </div>
  );
}

export default RegisterOwner;
