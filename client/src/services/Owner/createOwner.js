import httpRequest from "~/utils/httpRequest";

const createOwner = (
  businessName,
  address,
  phoneNumber,
  email,
  password,
  image
) => {
  const data = new FormData();
  data.append("business_name", businessName);
  data.append("address", address);
  data.append("phone_number", phoneNumber);
  data.append("email", email);
  data.append("password", password);
  data.append("profile_picture", image);

  return httpRequest.post("api/admin/owners", data);
};

export default createOwner;
