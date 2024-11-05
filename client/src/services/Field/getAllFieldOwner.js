import httpRequest from "~/utils/httpRequest";

const getAllFieldOwner = (page, limit) => {
  return httpRequest.get("api/owner/fields", {
    params: {
      page,
      limit,
    },
  });
};

export default getAllFieldOwner;
