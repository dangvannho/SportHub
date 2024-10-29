import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import routeConfig from "~/config/routeConfig";
import getUserById from "~/services/User/getUserById";
import updateUser from "~/services/User/updateUser";
import "./EditProfile.scss";

function EditProfile() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState("");

  const { setUserData } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      navigate(routeConfig.login);
      return;
    }
    setId(user.id);
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserById();
    }
  }, [id]);

  const fetchUserById = async () => {
    const res = await getUserById(id);
    if (res.EC === 1) {
      setEmail(res.user.email);
      setUsername(res.user.name);
      setPhoneNumber(res.user.phone_number);

      if (res.user.profile_picture) {
        setPreviewImage(`data:image/jpeg;base64,${res.user.profile_picture}`);
        setImage(res.user.profile_picture);
      } else {
        setPreviewImage("");
        setImage("");
      }
    } else {
      toast.error(res.EM);
    }
  };

  const handleUploadImage = (e) => {
    if (e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleUpdateUser = async () => {
    const trimUsername = username.trim();
    const trimPhoneNumber = phoneNumber.trim();

    if (!trimUsername || /\d/.test(trimUsername)) {
      toast.error("Invalid name!");
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

    const res = await updateUser(id, trimUsername, trimPhoneNumber, image);
    if (res.EC === 1) {
      toast.success(res.EM);

      const userUpdated = JSON.parse(localStorage.getItem("user"));
      userUpdated.name = res.updatedUser.name;
      userUpdated.avatar = res.updatedUser.profile_picture;

      console.log(userUpdated);

      localStorage.setItem("user", JSON.stringify(userUpdated));

      setUserData(userUpdated);

      fetchUserById();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <div className="profile-wrapper">
      <h3 className="profile-title">Thông tin cá nhân</h3>
      <span className="line"></span>

      <div className="edit-profile">
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
              <label className="form-label">Tên</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            {/* Address*/}
            {/* <div className="col-12">
              <label className="form-label">Địa chỉ</label>
              <input type="text" className="form-control" />
            </div> 
            */}
          </form>

          <button
            className=" btn btn-primary btn-update"
            onClick={handleUpdateUser}
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

export default EditProfile;
