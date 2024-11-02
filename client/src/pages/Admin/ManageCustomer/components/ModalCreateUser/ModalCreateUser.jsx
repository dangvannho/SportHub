import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";

import createUser from "~/services/User/createUser";
import "./ModalCreateUser.scss";

function ModalCreateUser({ showModalAdd, setShowModalAdd, fetchAllUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    setUsername("");
    setPhoneNumber("");
    setImage("");
    setPreviewImage("");
  };

  // btn close
  const handleClose = () => {
    setShowModalAdd(false);
    reset();
  };

  // submit create user
  const handleSubmitCreateUser = async () => {
    const trimEmail = email.trim();
    const trimUsername = username.trim();
    const trimPhoneNumber = phoneNumber.trim();

    // validate
    const isValidEmail = validateEmail(trimEmail);

    if (!isValidEmail) {
      toast.error("Email không hợp lệ!");
      return;
    }

    if (!password) {
      toast.error("Mật khẩu không được để trống!");
      return;
    }

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

    // call api
    const res = await createUser(
      trimUsername,
      trimEmail,
      password,
      trimPhoneNumber,
      image
    );
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
        show={showModalAdd}
        onHide={handleClose}
        backdrop="static"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm khách hàng</Modal.Title>
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
          <Button variant="primary" onClick={handleSubmitCreateUser}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreateUser;
