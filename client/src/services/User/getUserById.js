import httpRequest from "~/utils/httpRequest";

const getUserById = (id) => {
  return httpRequest.get(`api/admin/users/${id}`);
};

export default getUserById;
