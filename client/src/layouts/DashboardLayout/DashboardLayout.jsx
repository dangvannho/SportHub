import SideBar from "../components/Sidebar/Sidebar";
import "./DashboardLayout.scss";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="content">{children}</div>
    </div>
  );
}

export default DashboardLayout;
