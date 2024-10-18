import httpRequest from "~/utils/httpRequest";

const deleteOwner = (id) => {
  return httpRequest.delete(`api/admin//owners/${id}`);
};

export default deleteOwner;
