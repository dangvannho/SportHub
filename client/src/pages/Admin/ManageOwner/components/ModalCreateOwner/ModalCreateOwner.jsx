import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";

import createOwner from "~/services/Owner/createOwner";
import "./ModalCreateOwner.scss";

function ModalCreateOwner({ showModalAdd, setShowModalAdd, fetchAllOwner }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // // Xử lý rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  // Xử lí ảnh
  const handleUploadImage = (e) => {
    if (e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  // validateEmail
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setBusinessName("");
    setPhoneNumber("");
    setAddress("");
    setImage("");
    setPreviewImage("");
  };

  // btn close
  const handleClose = () => {
    setShowModalAdd(false);
    reset();
  };

  // submit create user
  const handleSubmitCreateOwner = async () => {
    const trimEmail = email.trim();
    const trimBusinessName = businessName.trim();
    const trimPhoneNumber = phoneNumber.trim();
    const trimAddress = address.trim();

    // validate
    const isValidEmail = validateEmail(trimEmail);

    if (!isValidEmail) {
      toast.error("Invalid email!");
      return;
    }
    if (!password) {
      toast.error("Invalid password!");
      return;
    }

    if (!trimBusinessName) {
      toast.error("Invalid business name!");
      return;
    }

    if (
      trimPhoneNumber.length !== 10 ||
      /\s/.test(trimPhoneNumber) ||
      /[a-zA-Z]/.test(trimPhoneNumber)
    ) {
      toast.error("Invalid phone number!");
      return;
    }

    if (!trimAddress) {
      toast.error("Invalid address!");
      return;
    }

    // call api
    const res = await createOwner(
      trimBusinessName,
      trimAddress,
      trimPhoneNumber,
      trimEmail,
      password,
      image
    );

    if (res.EC === 1) {
      toast.success(res.EM);
      handleClose();
      fetchAllOwner();
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
          <Modal.Title>Thêm chủ sân</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="row row-custom">
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
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

            <div className="col-md-12">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                onChange={(e) => handleUploadImage(e)}
              />
            </div>

            <div className="col-md-12 img-preview">
              {previewImage ? (
                <img src={previewImage} alt="" />
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
          <Button variant="primary" onClick={handleSubmitCreateOwner}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreateOwner;
