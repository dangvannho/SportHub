import httpRequest from "~/utils/httpRequest";

const deleteTimePrice = (field_id, price_id) => {
  return httpRequest.delete("api/owner/delete", {
    data: {
      field_id,
      price_id,
    },
  });
};

export default deleteTimePrice;
