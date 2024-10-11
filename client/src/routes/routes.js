import routeConfig from "~/config/routeConfig";

import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";

import Home from "~/pages/Home/Home";
import SportFields from "~/pages/SportFields/SportFields";
import FieldDetail from "~/pages/FieldDetail/FieldDetail";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";
import ManageCustomer from "~/pages/Admin/ManageCustomer/ManageCustomer";
import ManageOwner from "~/pages/Admin/ManageOwner/ManageOwner";
import ManagePayment from "~/pages/Admin/ManagePayment/ManagePayment";
import NotFound from "~/pages/NotFound/NotFound";

const publicRoutes = [
  // Main layout
  { path: routeConfig.home, component: Home },
  { path: routeConfig.sportFields, component: SportFields },
  { path: routeConfig.fieldDetail, component: FieldDetail },

  // None layout
  { path: routeConfig.login, component: Login, layout: null },
  { path: routeConfig.register, component: Register, layout: null },
  { path: routeConfig.notFound, component: NotFound, layout: null },

  // Dashboard layout
  {
    path: routeConfig.manageCustomer,
    component: ManageCustomer,
    layout: DashboardLayout,
  },
  {
    path: routeConfig.manageOwner,
    component: ManageOwner,
    layout: DashboardLayout,
  },
  {
    path: routeConfig.managePayment,
    component: ManagePayment,
    layout: DashboardLayout,
  },
];

export default publicRoutes;
