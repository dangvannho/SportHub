import httpRequest from "~/utils/httpRequest";

const getFieldDetail = (id) => {
  return httpRequest.get(`api/fields/${id}`);
};

export default getFieldDetail;
