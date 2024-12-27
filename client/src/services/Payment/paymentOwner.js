import httpRequest from "~/utils/httpRequest";

const paymentOwner = () => {
  return httpRequest.post("api/pmo");
};

export default paymentOwner;
