import httpRequest from "~/utils/httpRequest";

const payment = (_id) => {
  console.log(_id);

  return httpRequest.post("api/payment", { _id });
};

export default payment;
