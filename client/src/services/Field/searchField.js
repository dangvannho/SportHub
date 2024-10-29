import httpRequest from "~/utils/httpRequest";

const searchField = (query, page, limit) => {
  return httpRequest.get("api/fields/search", {
    params: {
      query,
      page,
      limit,
    },
  });
};

export default searchField;
