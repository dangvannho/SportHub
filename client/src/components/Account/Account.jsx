import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import routeConfig from "~/config/routeConfig";
import "./Account.scss";

function Account({ userData, setUserData }) {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    setUserData(null);
    navigate(routeConfig.login);
  };

  return (
    <div className="account-container" onClick={() => setShow(!show)}>
      {userData.avatar ? (
        <img src={`data:image/jpeg;base64,${userData.avatar}`} alt="" />
      ) : (
        <FaUser />
      )}

      <div className={`info-wrapper ${show ? "active" : ""}`}>
        <div className="info-personal">
          <a>{userData.name}</a>
          <Link to={routeConfig.editProfile}>Thông tin cá nhân</Link>
        </div>

        <button className="btn-logout" onClick={handleLogOut}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Account;
