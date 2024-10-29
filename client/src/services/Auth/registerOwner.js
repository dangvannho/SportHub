import httpRequest from "~/utils/httpRequest";

const registerOwner = (
  business_name,
  address,
  phone_number,
  email,
  password,
  confirmPassword
) => {
  const data = {
    business_name,
    address,
    phone_number,
    email,
    password,
    confirmPassword,
  };

  return httpRequest.post("api/auth/owner_register", data);
};

export default registerOwner;
