import httpRequest from "~/utils/httpRequest";

const averageStar = (id) => {
  return httpRequest.get(`api/comments/average/${id}`);
};

export default averageStar;
