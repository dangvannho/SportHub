import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { AppContext } from "~/context/AppContext";
import Account from "~/components/Account/Account";
import routeConfig from "~/config/routeConfig";
import "./Header.scss";

function Header() {
  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-content">
        <Link to={routeConfig.home} className="logo">
          <span>Sport</span>
          <span>Hub</span>
        </Link>

        <nav className="header-nav">
          <NavLink to={routeConfig.home} className="navlink">
            Trang chủ
          </NavLink>

          <NavLink to={routeConfig.sportFields} className="navlink">
            Danh sách sân bãi
          </NavLink>

          <a href="#footer" className="navlink">
            Giới thiệu
          </a>
          <NavLink to="/b" className="navlink">
            Chính sách
          </NavLink>
          <NavLink to="/c" className="navlink">
            Điều khoản
          </NavLink>
          <NavLink to="/d" className="navlink">
            Dành cho chủ sân
          </NavLink>
          <a href="#footer" className="navlink">
            Liên hệ
          </a>
        </nav>
        {userData ? (
          <Account userData={userData} setUserData={setUserData} />
        ) : (
          <div className="group-btn">
            <button
              className="btn btn-dark"
              onClick={() => navigate(routeConfig.login)}
            >
              Đăng nhập
            </button>
            <button
              className="btn btn-light"
              onClick={() => navigate(routeConfig.register)}
            >
              Đăng kí
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
