import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FcPlus } from "react-icons/fc";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import updateField from "~/services/Field/updateField";
import "../ModalCreateField/ModalCreateField.scss";

function ModalUpdateField({
  showModalUpdate,
  setShowModalUpdate,
  personalData,
  fetchAllFieldOwner,
}) {
  const [id, setId] = useState("");
  const [nameField, setNameField] = useState("");
  const [typeField, setTypeField] = useState("Bóng đá");
  const [location, setLocation] = useState("");
  const [description, setDecription] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(personalData)) {
      setId(personalData._id);
      setNameField(personalData.name);
      setTypeField(personalData.type);
      setLocation(personalData.location);
      setDecription(personalData.description);

      if (personalData.images && personalData.images.length > 0) {
        const previews = personalData.images.map((image) => ({
          id: uuidv4(),
          preview: `data:image/jpeg;base64,${image}`,
          file: image,
        }));
        setPreviewImages(previews);
        setImages(personalData.images);
      } else {
        setPreviewImages([]);
        setImages([]);
      }
    }
  }, [personalData]);

  // Xử lí ảnh
  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      id: uuidv4(),
      preview: URL.createObjectURL(file),
      file: file,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...newPreviews]); // Lưu các ảnh mới vào `images`

    e.target.value = null;
  };

  console.log(images);

  // Chức năng xóa ảnh
  const handleRemoveImage = (id) => {
    const previewToRemove = previewImages.find((img) => img.id === id);
    if (!previewToRemove) return;

    // Xóa ảnh khỏi `previewImages`
    setPreviewImages((prev) => prev.filter((img) => img.id !== id));

    if (typeof previewToRemove.file === "string") {
      // Thêm vào `imagesToDelete` nếu là ảnh cũ
      setImagesToDelete((prev) => [...prev, previewToRemove.file]);
      setImages((prev) => prev.filter((img) => img !== previewToRemove.file));
    } else {
      // Xóa ảnh mới khỏi `images`
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const handleClose = () => {
    setShowModalUpdate(false);
    setNameField(personalData.name);
    setTypeField(personalData.type);
    setLocation(personalData.location);
    setDecription(personalData.description);

    if (personalData.images && personalData.images.length > 0) {
      const previews = personalData.images.map((image) => ({
        id: uuidv4(),
        preview: `data:image/jpeg;base64,${image}`,
        file: image,
      }));
      setPreviewImages(previews);
      setImages(personalData.images);
    } else {
      setPreviewImages([]);
      setImages([]);
    }
  };

  const handleSubmitUpdate = async () => {
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

    const res = await updateField(
      id,
      trimNameField,
      trimLocation,
      typeField,
      trimDescription,
      images,
      imagesToDelete
    );

    if (res.EC === 1) {
      toast.success(res.EM);
      handleClose();
      fetchAllFieldOwner();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <>
      <Modal
        show={showModalUpdate}
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
                value={typeField}
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
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateField;
