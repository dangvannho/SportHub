import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { jwtDecode } from "jwt-decode";

import getAllHistoryBookingOwner from "~/services/Owner/getAllHistoryBookingOwner";
import "./ManageBooking.scss";

function ManageBooking() {
  const [listHitoryBooking, setListHistoryBooking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const token = localStorage.getItem("accessToken");
  const id = jwtDecode(token).id;

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllHistoryBooking();
  }, [currentPage]);

  const fetchAllHistoryBooking = async () => {
    const res = await getAllHistoryBookingOwner(id, currentPage, itemsPerPage);
    if (res.EC === 1) {
      setTotalPage(res.pagination.totalPages);
      setListHistoryBooking(res.DT);
    } else {
      toast.error(res.EM);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  return (
    <div className="booking-management">
      <div className="header-booking">
        <h4>Danh sách các lượt đặt sân</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Số điện thoại</th>
            <th>Sân đặt</th>
            <th>Giờ đặt</th>
            <th>Ngày đặt</th>
            <th>Khung giờ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {listHitoryBooking.map((booking, index) => (
            <tr key={index}>
              <td>{booking.ten_khach_hang}</td>
              <td>{booking.userPhone}</td>
              <td>
                <p className="field_name">{booking.ten_san}</p>
              </td>
              <td>{booking.gio_dat}</td>
              <td>{booking.ngay_dat}</td>
              <td>{booking.khung_gio}</td>
              <td>{booking.tong_tien.toLocaleString("vi-VN")} VNĐ</td>
              <td>
                <span className={`status ${booking.trang_thai.toLowerCase()}`}>
                  {booking.trang_thai}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPage}
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
        forcePage={currentPage - 1}
      />
    </div>
  );
}

export default ManageBooking;
