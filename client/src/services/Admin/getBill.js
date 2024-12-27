import httpRequest from "~/utils/httpRequest";

const getBill = (page, limit) => {
  return httpRequest.get("api/field_availability/bills_admin", {
    params: {
      page,
      limit,
    },
  });
};

export default getBill;
