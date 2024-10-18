import httpRequest from "~/utils/httpRequest";

const loginAdmin = (email, password) => {
  const info = {
    email,
    password,
  };
  return httpRequest.post("api/auth/admin_login", info);
};

export default loginAdmin;
