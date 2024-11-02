import httpRequest from "~/utils/httpRequest";

const updateField = (
  id,
  name,
  location,
  type,
  description,
  images,
  imagesToDelete
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("location", location);
  data.append("type", type);
  data.append("description", description);

  // Tải ảnh mới lên
  images.forEach((image) => {
    if (image.file && typeof image.file !== "string") {
      data.append("images", image.file);
    }
  });

  // Chứa ảnh xoá
  data.append("imagesToDelete", JSON.stringify(imagesToDelete));

  return httpRequest.put(`api/fields/${id}`, data);
};

export default updateField;
