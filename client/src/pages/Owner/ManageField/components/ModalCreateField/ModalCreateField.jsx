import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FcPlus } from "react-icons/fc";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import createField from "~/services/Field/createField";
import "./ModalCreateField.scss";
import { toast } from "react-toastify";

function ModalCreateField({
  showModalAdd,
  setShowModalAdd,
  fetchAllFieldOwner,
}) {
  const [nameField, setNameField] = useState("");
  const [typeField, setTypeField] = useState("Bóng đá");
  const [location, setLocation] = useState("");
  const [description, setDecription] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Xử lí ảnh
  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      id: uuidv4(), // Sử dụng uuid cho ID duy nhất
      preview: URL.createObjectURL(file),
      file: file,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);

    e.target.value = null;
  };

  // Chức năng xóa ảnh
  const handleRemoveImage = (id) => {
    // Tìm file cần xoá dựa trên ID trong previewImages
    const previewToRemove = previewImages.find((img) => img.id === id);
    if (!previewToRemove) return;

    // Xoá ảnh khỏi previewImages và images
    setPreviewImages((prev) => prev.filter((img) => img.id !== id));
    setImages((prev) => prev.filter((img) => img !== previewToRemove.file));
  };

  const reset = () => {
    setNameField("");
    setTypeField("Bóng đá");
    setLocation("");
    setDecription("");
    setImages([]);
    setPreviewImages([]);
  };

  const handleClose = () => {
    setShowModalAdd(false);
    reset();
  };

  const handleAddField = async () => {
    const trimNameField = nameField.trim();
    const trimLocation = location.trim();
    const trimDescription = description.trim();

    if (!trimNameField) {
      toast.error("Tên sân không được để trống!");
      return;
    }

    if (!trimLocation) {
      toast.error("Địa chỉ không được để trống!");
      return;
    }

    const res = await createField(
      trimNameField,
      trimLocation,
      trimDescription,
      images,
      typeField
    );

    if (res.EC === 1) {
      toast.success(res.EM);
      fetchAllFieldOwner();
      handleClose();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <>
      <Modal
        show={showModalAdd}
        onHide={handleClose}
        backdrop="static"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm sân</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="row row-custom">
            <div className="col-md-6">
              <label className="form-label">Tên sân</label>
              <input
                type="text"
                className="form-control"
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Loại sân</label>
              <select
                className="form-control"
                onChange={(e) => setTypeField(e.target.value)}
              >
                <option value="Bóng đá">Bóng đá</option>
                <option value="Bóng chuyền">Bóng chuyền</option>
                <option value="Bóng bàn">Bóng bàn</option>
                <option value="Tenis">Tenis</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mô tả</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDecription(e.target.value)}
              />
            </div>

            <div className="col-md-12 btn-upload">
              <label className="label-upload" htmlFor="label-upload">
                <FcPlus />
                Tải ảnh lên
              </label>
              <input
                type="file"
                accept="image/jpeg"
                id="label-upload"
                hidden
                multiple
                onChange={(e) => handleUploadImage(e)}
              />
            </div>

            <div className="col-md-12 img-preview-field">
              {previewImages.length > 0 ? (
                previewImages.map((image) => (
                  <div key={image.id} className="img-item">
                    <img src={image.preview} alt="preview" />
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <AiTwotoneCloseCircle />
                    </button>
                  </div>
                ))
              ) : (
                <span>Preview Images</span>
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddField}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreateField;
