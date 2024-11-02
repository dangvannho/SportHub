import { FaUser, FaUserTie } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import SideBar from "../components/Sidebar/Sidebar";
import "./DashboardLayout.scss";
import routeConfig from "~/config/routeConfig";

function DashboardLayout({ children }) {
  const heading = "ADMIN";
  const menuItems = [
    {
      title: "Quản lý khách hàng",
      path: routeConfig.manageCustomer,
      icon: <FaUser size={20} />,
    },
    {
      title: "Quản lý chủ sân",
      path: routeConfig.manageOwner,
      icon: <FaUserTie size={20} />,
    },
    {
      title: "Quản lý thanh toán",
      path: routeConfig.managePayment,
      icon: <AiOutlineTransaction size={20} />,
    },
  ];
  return (
    <div className="dashboard-container">
      <SideBar heading={heading} menuItems={menuItems} />
      <div className="content">{children}</div>
    </div>
  );
}

export default DashboardLayout;
