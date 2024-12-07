import httpRequest from "~/utils/httpRequest";

const bookingChart = (owner_id, type, month, year) => {
  return httpRequest.get("api/owner/chart/ownerBooking", {
    params: {
      owner_id,
      type,
      month,
      year,
    },
  });
};

export default bookingChart;
