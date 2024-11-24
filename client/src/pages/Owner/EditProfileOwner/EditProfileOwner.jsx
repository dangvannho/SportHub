import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import routeConfig from "~/config/routeConfig";
import getOwnerById from "~/services/Owner/getOwnerById";
import updateOwner from "~/services/Owner/updateOwner";
import "./EditProfileOwner.scss";

function EditProfileOwner() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState("");

  const { setOwnerData } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const owner = JSON.parse(localStorage.getItem("owner"));
    if (!owner) {
      navigate(routeConfig.login);
      return;
    }
    setId(owner.id);
  }, []);

  useEffect(() => {
    if (id) {
      fetchOwnerById();
    }
  }, [id]);

  const fetchOwnerById = async () => {
    const res = await getOwnerById(id);

    setEmail(res.owner.email);
    setBusinessName(res.owner.business_name);
    setPhoneNumber(res.owner.phone_number);
    setAddress(res.owner.address);

    if (res.owner.profile_picture) {
      setPreviewImage(`data:image/jpeg;base64,${res.owner.profile_picture}`);
      setImage(res.owner.profile_picture);
    } else {
      setPreviewImage("");
      setImage("");
    }
  };

  const handleUploadImage = (e) => {
    if (e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleUpdateOwner = async () => {
    const trimBusinessName = businessName.trim();
    const trimAddress = address.trim();
    const trimPhoneNumber = phoneNumber.trim();

    if (!trimBusinessName || /\d/.test(trimBusinessName)) {
      toast.error("Họ và tên không hợp lệ!");
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

    if (!trimAddress) {
      toast.error("Địa chỉ không được bỏ trống!");
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

      const ownerUpdated = JSON.parse(localStorage.getItem("owner"));
      ownerUpdated.name = res.data.business_name;
      ownerUpdated.avatar = res.data.profile_picture;

      localStorage.setItem("owner", JSON.stringify(ownerUpdated));

      setOwnerData(ownerUpdated);

      fetchOwnerById();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <div className="profile-owner-wrapper">
      <div className="edit-profile-owner">
        <div className="edit-profile-left">
          <h4>Chỉnh sửa thông tin</h4>

          <form className="row g-3 form-edit">
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
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </form>

          <button
            className=" btn btn-primary btn-update"
            onClick={handleUpdateOwner}
          >
            Cập nhật
          </button>
        </div>
        <div className="edit-profile-right">
          <div className="avatar">
            {previewImage ? (
              <img src={previewImage} alt="" />
            ) : (
              <FaUser color="rgba(208, 212, 217, 0.5)" size={50} />
            )}
          </div>
          <div className="btn-upload">
            <label htmlFor="upload" className="label-upload">
              <FcPlus />
              Tải ảnh lên
            </label>
            <input
              type="file"
              accept="image/jpeg"
              hidden
              id="upload"
              onChange={(e) => handleUploadImage(e)}
            />
          </div>

          <p>(Kích thước tốt nhất là cao 200px, rộng 300px)</p>
        </div>
      </div>
    </div>
  );
}

export default EditProfileOwner;
