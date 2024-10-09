import routeConfig from "~/config/routeConfig";

import Home from "~/pages/Home/Home";
import SportFields from "~/pages/SportFields/SportFields";
import FieldDetail from "~/pages/FieldDetail/FieldDetail";
import Login from "~/pages/Login/Login";

const publicRoutes = [
  // Main layout
  { path: routeConfig.home, component: Home },
  { path: routeConfig.sportFields, component: SportFields },
  { path: routeConfig.fieldDetail, component: FieldDetail },

  // None layout
  { path: routeConfig.login, component: Login, layout: null },
];

export default publicRoutes;
