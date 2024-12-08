import { IoMdFootball } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import AccountOwner from "~/components/AccountOwner/AccountOwner";
import routeConfig from "~/config/routeConfig";
import SideBar from "../components/Sidebar/Sidebar";
import "./OwnerLayout.scss";

function OwnerLayout({ children }) {
  const { ownerData } = useContext(AppContext);
  const heading = "CHỦ SÂN";
  const menuItems = [
    {
      title: "Thống kê",
      path: routeConfig.dashboard,
      icon: <MdOutlineDashboard size={25} />,
    },
    {
      title: "Quản lý sân",
      path: routeConfig.manageField,
      icon: <IoMdFootball size={25} />,
    },

    {
      title: "Quản lý đặt sân",
      path: routeConfig.manageBooking,
      icon: <TbBrandBooking size={25} />,
    },

    {
      title: "Thông tin cá nhân",
      path: routeConfig.editProfileOwner,
      icon: <FaUserEdit size={25} />,
    },
  ];
  return (
    <div className="owner-container">
      <SideBar heading={heading} menuItems={menuItems} />
      <div className="content">
        <div className="header-content">
          {ownerData && <AccountOwner ownerData={ownerData} />}
        </div>
        <div className="content-page"> {children} </div>
      </div>
    </div>
  );
}

export default OwnerLayout;
