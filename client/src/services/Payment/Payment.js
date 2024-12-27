import httpRequest from "~/utils/httpRequest";

const payment = (_id) => {
  return httpRequest.post("api/pm", { _id });
};

export default payment;
