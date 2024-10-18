import routeConfig from "~/config/routeConfig";

import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";

import Home from "~/pages/Home/Home";
import SportFields from "~/pages/SportFields/SportFields";
import FieldDetail from "~/pages/FieldDetail/FieldDetail";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";

import LoginAdmin from "~/pages/Admin/LoginAdmin/LoginAdmin";
import ManageCustomer from "~/pages/Admin/ManageCustomer/ManageCustomer";
import ManageOwner from "~/pages/Admin/ManageOwner/ManageOwner";
import ManagePayment from "~/pages/Admin/ManagePayment/ManagePayment";
import NotFound from "~/pages/NotFound/NotFound";

import { AdminRoute } from "./ProtectRoute";

const publicRoutes = [
  // Main layout
  { path: routeConfig.home, component: <Home /> },
  { path: routeConfig.sportFields, component: <SportFields /> },
  { path: routeConfig.fieldDetail, component: <FieldDetail /> },

  // // None layout
  { path: routeConfig.login, component: <Login />, layout: null },
  { path: routeConfig.register, component: <Register />, layout: null },
  { path: routeConfig.adminLogin, component: <LoginAdmin />, layout: null },
  { path: routeConfig.notFound, component: <NotFound />, layout: null },

  // Dashboard layout
  {
    path: routeConfig.manageCustomer,
    component: (
      <AdminRoute>
        <ManageCustomer />
      </AdminRoute>
    ),
    layout: DashboardLayout,
  },
  {
    path: routeConfig.manageOwner,
    component: (
      <AdminRoute>
        <ManageOwner />
      </AdminRoute>
    ),
    layout: DashboardLayout,
  },
  {
    path: routeConfig.managePayment,
    component: (
      <AdminRoute>
        <ManagePayment />
      </AdminRoute>
    ),
    layout: DashboardLayout,
  },
];

export default publicRoutes;
