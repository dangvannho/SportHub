import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";
import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-content">
        <p style={{ fontSize: 20, margin: 0, color: "white" }}>Logo</p>

        <nav className="header-nav">
          <NavLink to={routeConfig.home} className="navlink">
            Trang chủ
          </NavLink>

          <NavLink to={routeConfig.sportFields} className="navlink">
            Danh sách sân bãi
          </NavLink>

          <NavLink to="/a" className="navlink">
            Giới thiệu
          </NavLink>
          <NavLink to="/b" className="navlink">
            Chính sách
          </NavLink>
          <NavLink to="/c" className="navlink">
            Điều khoản
          </NavLink>
          <NavLink to="/d" className="navlink">
            Dành cho chủ sân
          </NavLink>
          <NavLink to="/e" className="navlink">
            Liên hệ
          </NavLink>
        </nav>

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
      </div>
    </div>
  );
}

export default Header;
