import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";

import routeConfig from "~/config/routeConfig";
import "./Account.scss";

function Account({ userData, setUserData }) {
  const [show, setShow] = useState(false);
  const accountRef = useRef(null);

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    setUserData(null);
    navigate(routeConfig.login);
  };

  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup event listener khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  return (
    <div
      ref={accountRef}
      className="account-container"
      onClick={() => setShow(!show)}
    >
      {userData.avatar ? (
        <div className="avatar-box">
          <img src={`data:image/jpeg;base64,${userData.avatar}`} alt="" />
        </div>
      ) : (
        <FaUser color="white" />
      )}
      <p className="username">
        {userData.name}
        <MdArrowDropDown size={20} color="white" />
      </p>

      <div className={`info-wrapper ${show ? "active" : ""}`}>
        <div className="info-personal">
          <Link to={routeConfig.editProfile}>Thông tin cá nhân</Link>
          <Link to={routeConfig.historyBooking}>Lịch sử đặt sân</Link>
        </div>

        <button className="btn-logout" onClick={handleLogOut}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Account;
