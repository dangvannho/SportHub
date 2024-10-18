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
      } else {
        setPreviewImage("");
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
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmitUpdate = async () => {
    const userUpdate = await updateUser(
      id,
      username,
      email,
      password,
      phoneNumber,
      image
    );
    console.log(userUpdate);
    toast.success("User updated");
    handleClose();
    fetchAllUser();
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
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                disabled
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone number</label>
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
                Upload File Image
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateUser;