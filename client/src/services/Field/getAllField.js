import httpRequest from "~/utils/httpRequest";

const getAllField = (page, limit, type) => {
  return httpRequest.get("api/fields", {
    params: {
      page,
      limit,
      type,
    },
  });
};

export default getAllField;
