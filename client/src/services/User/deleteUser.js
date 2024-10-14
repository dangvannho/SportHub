import httpRequest from "~/utils/httpRequest";

const deleteUser = (id) => {
  return httpRequest.delete(`api/admin/users/${id}`);
};

export default deleteUser;
