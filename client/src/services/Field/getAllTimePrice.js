import httpRequest from "~/utils/httpRequest";

const getAllTimePrice = (field_id) => {
  return httpRequest.get("api/owner/priceSlots", {
    params: {
      field_id,
    },
  });
};

export default getAllTimePrice;
