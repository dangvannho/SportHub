import { GiSoccerField } from "react-icons/gi";
import { FaUserEdit } from "react-icons/fa";
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
      title: "Quản lý sân",
      path: routeConfig.manageField,
      icon: <GiSoccerField size={25} />,
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
