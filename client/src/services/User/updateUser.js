import httpRequest from "~/utils/httpRequest";

const updateUser = (id, username, phoneNumber, image) => {
  const data = new FormData();
  data.append("name", username);
  data.append("phone_number", phoneNumber);
  data.append("profile_picture", image);
  return httpRequest.put(`api/admin/users/${id}`, data);
};

export default updateUser;
