import httpRequest from "~/utils/httpRequest";

const getAllOnwer = (page, limit) => {
  return httpRequest.get("api/admin/owners", {
    params: {
      page,
      limit,
    },
  });
};

export default getAllOnwer;
