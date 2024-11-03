import { NavLink } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";

import "./SideBar.scss";
function SideBar({ heading = "ADMIN", menuItems = [] }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate(routeConfig.login);
  };
  return (
    <aside className="sidebar-wrapper">
      <h2 className="heading">{heading}</h2>
      <div className="sidebar-content">
        <div className="group">
          {menuItems.map((item, index) => {
            return (
              <NavLink key={index} to={item.path} className="item">
                {item.icon}
                {item.title}
              </NavLink>
            );
          })}
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <IoIosLogOut />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
