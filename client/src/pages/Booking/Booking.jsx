import { useState } from "react";
import "./Booking.scss";

function Booking({ selectedSlot, onClose }) {
  const [formData, setFormData] = useState({
    hoTen: "",
    diDong: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đặt lịch ở đây
    console.log("Form submitted:", formData);
  };

  return (
    <div className="booking-container">
      <h2>Đặt lịch ở Sân Ulis</h2>

      <div className="booking-content">
        <div className="left-section">
          <h3>Quét QR để đặt lịch</h3>
          <div className="qr-code-container">
            <img
              src="https://quantrinhahang.edu.vn/wp-content/uploads/2019/07/qr-code-la-gi.jpg"
              alt="QR Code"
            />
          </div>
        </div>

        <div className="right-section">
          <h3>THÔNG TIN CHI TIẾT ĐẶT SÂN</h3>
          <div className="info-row">
            <span className="label">Đơn vị lịch hẹn:</span>
            <span className="value">Giờ thường - 500000</span>
          </div>
          <div className="info-row">
            <span className="label">Giá:</span>
            <span className="value">500.000 đ</span>
          </div>
          <div className="info-row">
            <span className="label">Ngày:</span>
            <span className="value">
              {selectedSlot?.start
                ? new Date(selectedSlot.start).toLocaleDateString()
                : ""}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Giờ:</span>
            <span className="value">
              {selectedSlot?.time || "07:00 - 08:30"}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Địa chỉ:</span>
            <span className="value">Số 2 Phạm Văn Đồng</span>
          </div>
          <div className="info-row">
            <span className="label">Số điện thoại:</span>
            <span className="value">0978210895</span>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="booking-btn" onClick={handleSubmit}>
          ĐẶT LỊCH
        </button>
        <button className="cancel-btn" onClick={onClose}>
          HỦY
        </button>
      </div>
    </div>
  );
}

export default Booking;
