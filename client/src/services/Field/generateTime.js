import httpRequest from "~/utils/httpRequest";

const generateTime = (field_id, startDate, endDate) => {
  const data = {
    field_id,
    startDate,
    endDate,
  };
  return httpRequest.post("api/owner/generate", data);
};

export default generateTime;
