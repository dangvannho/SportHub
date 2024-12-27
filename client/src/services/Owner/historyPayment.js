import httpRequest from "~/utils/httpRequest";

const historyPayment = (user_id, page, limit) => {
  return httpRequest.get("api/field_availability/bills_owner_admin", {
    params: {
      user_id,
      page,
      limit,
    },
  });
};

export default historyPayment;
