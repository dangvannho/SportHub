import httpRequest from "~/utils/httpRequest";

const deleteField = (id) => {
  return httpRequest.delete(`api/fields/${id}`);
};

export default deleteField;
