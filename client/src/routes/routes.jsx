import routeConfig from "~/config/routeConfig";

import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";
import OwnerLayout from "~/layouts/OwnerLayout/OwnerLayout";

import Home from "~/pages/Home/Home";
import SportFields from "~/pages/SportFields/SportFields";
import FieldDetail from "~/pages/FieldDetail/FieldDetail";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";
import RegisterUser from "~/pages/RegisterUser/RegisterUser";
import RegisterOwner from "~/pages/ResgiterOwner/RegisterOwner";
import EditProfile from "~/pages/EditProfile/EditProfile";
import Booking from "~/pages/Booking/Booking";

// Owner
import ManageField from "~/pages/Owner/ManageField/ManageField";
import EditProfileOwner from "~/pages/Owner/EditProfileOwner/EditProfileOwner";
import ManageCalendar from "~/pages/Owner/ManageCalendar/ManageCalendar";

// admin
// import LoginAdmin from "~/pages/Admin/LoginAdmin/LoginAdmin";
import ManageCustomer from "~/pages/Admin/ManageCustomer/ManageCustomer";
import ManageOwner from "~/pages/Admin/ManageOwner/ManageOwner";
import ManagePayment from "~/pages/Admin/ManagePayment/ManagePayment";
import NotFound from "~/pages/NotFound/NotFound";

import { AdminRoute, OwnerRoute, UserRoute } from "./ProtectRoute";

const publicRoutes = [
  // Main layout
  { path: routeConfig.home, component: <Home /> },
  { path: routeConfig.sportFields, component: <SportFields /> },
  { path: routeConfig.fieldDetail, component: <FieldDetail /> },
  {
    path: routeConfig.editProfile,
    component: (
      <UserRoute>
        <EditProfile />
      </UserRoute>
    ),
  },

  // None layout
  { path: routeConfig.login, component: <Login />, layout: null },
  // { path: routeConfig.adminLogin, component: <LoginAdmin />, layout: null },

  {
    path: routeConfig.register,
    component: <Register />,
    layout: null,
  },
  { path: routeConfig.registerUser, component: <RegisterUser />, layout: null },
  {
    path: routeConfig.registerOwner,
    component: <RegisterOwner />,
    layout: null,
  },
  {
    path: routeConfig.booking,
    component: (
      <UserRoute>
        <Booking />
      </UserRoute>
    ),
    layout: null,
  },

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

  // Owner Layout
  {
    path: routeConfig.manageField,
    component: (
      <OwnerRoute>
        <ManageField />
      </OwnerRoute>
    ),
    layout: OwnerLayout,
  },
  {
    path: routeConfig.editProfileOwner,
    component: (
      <OwnerRoute>
        <EditProfileOwner />
      </OwnerRoute>
    ),
    layout: OwnerLayout,
  },
  {
    path: routeConfig.manageCalendar,
    component: (
      <OwnerRoute>
        <ManageCalendar />
      </OwnerRoute>
    ),
    layout: OwnerLayout,
  },
];

export default publicRoutes;
