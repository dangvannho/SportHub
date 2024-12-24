import httpRequest from "~/utils/httpRequest";

const searchField = (type, name, location, page, limit) => {
  return httpRequest.get("api/fields/search", {
    params: {
      type,
      name,
      location,
      page,
      limit,
    },
  });
};

export default searchField;
