import routeConfig from "~/config/routeConfig";

import Home from "~/pages/Home/Home";
import SportsField from "~/pages/SportsField/SportsField";

const publicRoutes = [
  { path: routeConfig.home, component: Home },
  { path: routeConfig.sportsField, component: SportsField },
];

export default publicRoutes;
