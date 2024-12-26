import httpRequest from "~/utils/httpRequest";

const getAllHistoryBookingOwner = (owner_id, page, limit) => {
  return httpRequest.get("api/field_availability/bills_owner", {
    params: {
      owner_id,
      page,
      limit,
    },
  });
};

export default getAllHistoryBookingOwner;
