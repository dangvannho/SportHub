import httpRequest from "~/utils/httpRequest";

const getAllHistoryBookingUser = (user_id) => {
  return httpRequest.get("api/field_availability/bills_user", {
    params: {
      user_id,
    },
  });
};
export default getAllHistoryBookingUser;
