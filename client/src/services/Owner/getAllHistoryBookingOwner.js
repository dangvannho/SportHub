import httpRequest from "~/utils/httpRequest";

const getAllHistoryBookingOwner = (owner_id) => {
  return httpRequest.get("api/field_availability/bills_owner", {
    params: {
      owner_id,
    },
  });
};

export default getAllHistoryBookingOwner;
