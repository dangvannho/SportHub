import httpRequest from "~/utils/httpRequest";

const paymentCheck = (apptransid) => {
  const data = {
    apptransid,
  };
  return httpRequest.post("api/pmo/check", data);
};
export default paymentCheck;
