import httpRequest from "~/utils/httpRequest";

const createUser = (username, email, password, phoneNumber, image) => {
  const data = new FormData();
  data.append("name", username);
  data.append("email", email);
  data.append("password", password);
  data.append("phone_number", phoneNumber);
  data.append("profile_picture", image);

  return httpRequest.post("api/admin/users", data);
};

export default createUser;
