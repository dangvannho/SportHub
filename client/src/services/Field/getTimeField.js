import httpRequest from "~/utils/httpRequest";

const getTimeField = (field_id) => {
  return httpRequest.get("api/field_availability/availability", {
    params: {
      field_id,
    },
  });
};

export default getTimeField;
