import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import getAllHistoryBookingUser from "~/services/User/getHistoryBookingUser";
import "./HistoryBooking.scss";

function HistoryBooking() {
  const [listHitoryBooking, setListHistoryBooking] = useState([]);

  const token = localStorage.getItem("accessToken");

  const id = jwtDecode(token).id;

  useEffect(() => {
    fetchAllHistoryBooking();
  }, []);

  const fetchAllHistoryBooking = async () => {
    const res = await getAllHistoryBookingUser(id);
    if (res.EC === 1) {
      setListHistoryBooking(res.DT);
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <div className="booking-history">
      <div className="booking-history-header">
        <h1>Lịch sử đặt sân</h1>
        <p>{listHitoryBooking.length} lượt đặt sân gần nhất</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên sân</th>
            <th>Địa điểm</th>
            <th>Giờ đặt</th>
            <th>Ngày</th>
            <th>Khung giờ</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {listHitoryBooking.map((booking, index) => (
            <tr key={index}>
              <td>
                <p className="field_name">{booking.ten_san}</p>
              </td>
              <td className="field_address">{booking.dia_diem}</td>
              <td>{booking.gio_dat}</td>
              <td>{booking.ngay_dat}</td>
              <td>{booking.khung_gio}</td>
              <td>{booking.tong_tien.toLocaleString("vi-VN")} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryBooking;
