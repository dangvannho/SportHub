import httpRequest from "~/utils/httpRequest";

const login = (email, password) => {
  const data = {
    email,
    password,
  };

  return httpRequest.post("api/auth/login", data);
};

export default login;
