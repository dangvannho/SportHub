import httpRequest from "~/utils/httpRequest";

const createField = (name, location, description, images, type) => {
  const data = new FormData();
  data.append("name", name);
  data.append("location", location);
  data.append("description", description);
  images.forEach((image) => {
    data.append("images", image);
  });
  data.append("type", type);

  return httpRequest.post("api/fields", data);
};

export default createField;
