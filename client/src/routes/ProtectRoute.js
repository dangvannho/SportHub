import useAuthRedirect from "~/hooks/useAuthRedirect";

const AdminRoute = ({ children }) => {
  useAuthRedirect("admin");
  return children;
};

const OwnerRoute = ({ children }) => {
  useAuthRedirect("owner");
  return children;
};

const UserRoute = ({ children }) => {
  useAuthRedirect("user");
  return children;
};

export {AdminRoute, OwnerRoute, UserRoute}