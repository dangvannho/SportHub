import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import updateUser from "~/services/User/updateUser";
import "../ModalCreateUser/ModalCreateUser.scss";

function ModalUpdateUser({
  showModalUpdate,
  setShowModalUpdate,
  personalData,
  fetchAllUser,
}) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!_.isEmpty(personalData)) {
      setId(personalData._id);
      setEmail(personalData.email);
      setPassword(personalData.password);
      setUsername(personalData.name);
      setPhoneNumber(personalData.phone_number);

      if (personalData.profile_picture) {
        setPreviewImage(
          `data:image/jpeg;base64,${personalData.profile_picture}`
        );
        setImage(personalData.profile_picture);
      } else {
        setPreviewImage("");
        setImage("");
      }
    }
  }, [personalData]);

  const handleUploadImage = (e) => {
    if (e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setShowModalUpdate(false);
    setEmail(personalData.email);
    setPassword(personalData.password);
    setUsername(personalData.name);
    setPhoneNumber(personalData.phone_number);

    if (personalData.profile_picture) {
      setPreviewImage(`data:image/jpeg;base64,${personalData.profile_picture}`);
      setImage(personalData.profile_picture);
    } else {
      setPreviewImage("");
      setImage("");
    }
  };

  const handleSubmitUpdate = async () => {
    const trimUsername = username.trim();
    const trimPhoneNumber = phoneNumber.trim();

    if (!trimUsername || /\d/.test(trimUsername)) {
      toast.error("Tên không hợp lệ!");
      return;
    }

    if (
      trimPhoneNumber.length !== 10 ||
      /\s/.test(trimPhoneNumber) ||
      /[a-zA-Z]/.test(trimPhoneNumber)
    ) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    const res = await updateUser(id, trimUsername, trimPhoneNumber, image);

    if (res.EC === 1) {
      toast.success(res.EM);
      handleClose();
      fetchAllUser();
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
          <Modal.Title>Cập nhật thông tin khách hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="row row-custom">
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                disabled
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                onChange={(e) => handleUploadImage(e)}
              />
            </div>

            <div className="col-md-12 img-preview">
              {previewImage ? (
                <img src={previewImage} alt="lỗi" />
              ) : (
                <span>Preview Image</span>
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

export default ModalUpdateUser;
