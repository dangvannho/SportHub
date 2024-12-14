import httpRequest from "~/utils/httpRequest";

const bookingChart = (owner_id, field_id, type, month, year) => {
  return httpRequest.get("api/owner/chart/getBookings", {
    params: {
      owner_id,
      field_id,
      type,
      month,
      year,
    },
  });
};

export default bookingChart;
