import httpRequest from "~/utils/httpRequest";

const revenueChart = (owner_id, field_id, type, month, year) => {
  return httpRequest.get("api/owner/chart/getRevenue", {
    params: {
      owner_id,
      field_id,
      type,
      month,
      year,
    },
  });
};

export default revenueChart;
