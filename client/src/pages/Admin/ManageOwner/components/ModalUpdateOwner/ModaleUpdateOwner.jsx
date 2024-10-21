import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import updateOwner from "~/services/Owner/updateOwner";
import "../ModalCreateOwner/ModalCreateOwner.scss";

function ModalUpdateOwner({
  showModalUpdate,
  setShowModalUpdate,
  personalData,
  fetchAllOwner,
}) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!_.isEmpty(personalData)) {
      setId(personalData._id);
      setEmail(personalData.email);
      setPassword(personalData.password);
      setBusinessName(personalData.business_name);
      setPhoneNumber(personalData.phone_number);
      setAddress(personalData.address);

      if (personalData.profile_picture) {
        setPreviewImage(
          `data:image/jpeg;base64,${personalData.profile_picture}`
        );
      } else {
        setPreviewImage("");
      }
    }
  }, [personalData]);

  const handleChangeBusinessName = (e) => {
    const businessNameValue = e.target.value;

    if (!businessNameValue.startsWith(" ")) {
      setBusinessName(businessNameValue);
    }
  };

  const handleChangePhone = (e) => {
    const phoneValue = e.target.value;

    if (!phoneValue.startsWith(" ")) {
      setPhoneNumber(phoneValue);
    }
  };

  const handleChangeAddress = (e) => {
    const addressValue = e.target.value;

    if (!addressValue.startsWith(" ")) {
      setAddress(addressValue);
    }
  };

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
    setBusinessName(personalData.business_name);
    setPhoneNumber(personalData.phone_number);
    setAddress(personalData.address);

    if (personalData.profile_picture) {
      setPreviewImage(`data:image/jpeg;base64,${personalData.profile_picture}`);
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmitUpdate = async () => {
    const trimBusinessName = businessName.trim();
    const trimPhoneNumber = phoneNumber.trim();
    const trimAddress = address.trim();

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

    const res = await updateOwner(
      id,
      trimBusinessName,
      trimAddress,
      trimPhoneNumber,
      image
    );

    if (res.EC === 1) {
      toast.success(res.EM);
      fetchAllOwner();
      handleClose();
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
          <Modal.Title>Cập nhật thông tin chủ sân</Modal.Title>
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
              <label className="form-label">Business name</label>
              <input
                type="text"
                className="form-control"
                value={businessName}
                onChange={handleChangeBusinessName}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone number</label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={handleChangePhone}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={handleChangeAddress}
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

export default ModalUpdateOwner;
