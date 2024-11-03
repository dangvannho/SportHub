import httpRequest from "~/utils/httpRequest";

const getOwnerById = (id) => {
  return httpRequest.get(`api/admin/owners/${id}`);
};

export default getOwnerById;
