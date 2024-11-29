import { useState } from "react";
import "./HistoryBooking.scss";

function HistoryBooking() {
  const [bookings] = useState([
    {
      id: 1,
      name: "Sân bóng Hoàng Gia",
      location: "Quận 1, TP.HCM",
      bookingId: "BK001",
      date: "24/11/2024",
      time: "18:00 - 20:00",
      total: "500,000 VND",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Sân cỏ Việt Nhật",
      location: "Quận 7, TP.HCM",
      bookingId: "BK002",
      date: "23/11/2024",
      time: "16:00 - 18:00",
      total: "400,000 VND",
      status: "Cancelled",
    },
    {
      id: 3,
      name: "Sân Đạt Phước",
      location: "Quận 3, TP.HCM",
      bookingId: "BK003",
      date: "22/11/2024",
      time: "19:00 - 21:00",
      total: "600,000 VND",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Sân Đạt Phước",
      location: "Quận 3, TP.HCM",
      bookingId: "BK003",
      date: "22/11/2024",
      time: "19:00 - 21:00",
      total: "600,000 VND",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Sân Đạt Phước",
      location: "Quận 3, TP.HCM",
      bookingId: "BK003",
      date: "22/11/2024",
      time: "19:00 - 21:00",
      total: "600,000 VND",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Sân Đạt Phước",
      location: "Quận 3, TP.HCM",
      bookingId: "BK003",
      date: "22/11/2024",
      time: "19:00 - 21:00",
      total: "600,000 VND",
      status: "Confirmed",
    },
  ]);

  return (
    <div className="booking-history">
      <div className="booking-history-header">
        <h1>Lịch sử đặt sân</h1>
        <p>3 lượt đặt sân gần đây</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên sân</th>
            <th>Địa điểm</th>
            <th>Mã đặt sân</th>
            <th>Ngày</th>
            <th>Khung giờ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <div className="field-info">
                  <strong>{booking.name}</strong>
                  <p>{booking.location}</p>
                </div>
              </td>
              <td>{booking.location}</td>
              <td>{booking.bookingId}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>{booking.total}</td>
              <td>
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryBooking;
