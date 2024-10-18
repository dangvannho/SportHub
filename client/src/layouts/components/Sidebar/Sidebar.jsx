import { Link } from "react-router-dom";
import { FaUser, FaUserTie } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";

import "./SideBar.scss";
function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate(routeConfig.adminLogin);
  };
  return (
    <aside className="sidebar-wrapper">
      <h2 className="heading">ADMIN</h2>
      <div className="sidebar-content">
        <div className="group">
          <Link to={routeConfig.manageCustomer} className="item">
            <FaUser size={20} />
            Quản lý khách hàng
          </Link>

          <Link to={routeConfig.manageOwner} className="item">
            <FaUserTie size={20} />
            Quản lý chủ sân
          </Link>

          <Link to={routeConfig.managePayment} className="item">
            <AiOutlineTransaction size={20} />
            Quản lý thanh toán
          </Link>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <IoIosLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
