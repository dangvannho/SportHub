import routeConfig from "~/config/routeConfig";

import Home from "~/pages/Home/Home";
import SportFields from "~/pages/SportFields/SportFields";

const publicRoutes = [
  { path: routeConfig.home, component: Home },
  { path: routeConfig.sportFields, component: SportFields },
];

export default publicRoutes;
