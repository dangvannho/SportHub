import httpRequest from "~/utils/httpRequest";

const addTimePrice = (field_id, startHour, endHour, price, is_weekend) => {
  const data = {
    field_id,
    startHour,
    endHour,
    price,
    is_weekend,
  };
  return httpRequest.post("api/owner/add", data);
};

export default addTimePrice;
