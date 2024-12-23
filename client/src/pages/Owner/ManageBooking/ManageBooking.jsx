import { useState } from "react";
import ReactPaginate from "react-paginate";
import "./ManageBooking.scss";

function ManageBooking() {
  const [bookings] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      fieldName: "Sân bóng Hoàng Gia",
      bookingId: "BK001",
      date: "24/11/2024",
      time: "18:00 - 20:00",
      total: "500,000 VND",
      status: "Complete",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      fieldName: "Sân cỏ Việt Nhật",
      bookingId: "BK002",
      date: "23/11/2024",
      time: "16:00 - 18:00",
      total: "400,000 VND",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Phạm Văn C",
      fieldName: "Sân Đạt Phước",
      bookingId: "BK003",
      date: "22/11/2024",
      time: "19:00 - 21:00",
      total: "600,000 VND",
      status: "Canceled",
    },
  ]);

  return (
    <div className="booking-management">
      <div className="header-booking">
        <h4>Danh sách các lượt đặt sân</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Sân đặt</th>
            <th>Ngày</th>
            <th>Khung giờ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.customerName}</td>
              <td>{booking.fieldName}</td>
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

      <ReactPaginate
        nextLabel="next >"
        onPageChange={() => console.log(123)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={5}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        // forcePage={currentPage - 1}
      />
    </div>
  );
}

export default ManageBooking;
