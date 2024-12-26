import httpRequest from "~/utils/httpRequest";

const totalComment = (id) => {
  return httpRequest.get(`api/comments/stats/${id}`);
};

export default totalComment;
