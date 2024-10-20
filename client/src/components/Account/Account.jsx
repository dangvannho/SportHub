import { useState } from "react";
import { FaUser } from "react-icons/fa";

import "./Account.scss";

function Account({ user, setUser }) {
  const [show, setShow] = useState(false);

  const handleLogOut = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="account-container" onClick={() => setShow(!show)}>
      <FaUser size={18} />

      <div className={`info-wrapper ${show ? "active" : ""}`}>
        <div className="info-personal">
          <a href="#!">{user.name}</a>
          <a href="#!">Thông tin cá nhân</a>
          <a href="#!">Thông tin cá nhân</a>
        </div>

        <button className="btn-logout" onClick={handleLogOut}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Account;
