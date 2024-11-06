import httpRequest from "~/utils/httpRequest";

const updateTimePrice = (field_id, price_id, newPrice) => {
  const data = {
    field_id,
    price_id,
    newPrice,
  };
  return httpRequest.put("api/owner/update", data);
};

export default updateTimePrice;
