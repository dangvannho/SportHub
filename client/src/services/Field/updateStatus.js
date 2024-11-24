import httpRequest from "~/utils/httpRequest";

const updateStatus = (id, is_available) => {
  const data = {
    id,
    is_available,
  };
  return httpRequest.put("api/field_availability/update_status", data);
};

export default updateStatus;
