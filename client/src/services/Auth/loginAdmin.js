import httpRequest from "~/utils/httpRequest";

const loginAdmin = (email, password) => {
  const data = {
    email,
    password,
  };
  return httpRequest.post("api/auth/admin_login", data);
};

export default loginAdmin;
