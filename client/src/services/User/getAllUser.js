import httpRequest from "~/utils/httpRequest";

const getAllUser = (page, limit) => {
  return httpRequest.get("api/admin/users", {
    params: {
      page,
      limit,
    },
  });
};

export default getAllUser;
