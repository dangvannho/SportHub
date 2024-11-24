import httpRequest from "~/utils/httpRequest";

const deleteTime = (id) => {
  return httpRequest.delete(`api/field_availability/delete/${id}`);
};

export default deleteTime;
