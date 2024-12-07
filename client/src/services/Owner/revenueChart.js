import httpRequest from "~/utils/httpRequest";

const revenueChart = (owner_id, type, month, year) => {
  return httpRequest.get("api/owner/chart/ownerRevenue", {
    params: {
      owner_id,
      type,
      month,
      year,
    },
  });
};

export default revenueChart;
