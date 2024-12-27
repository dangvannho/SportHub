import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { jwtDecode } from "jwt-decode";

import historyPayment from "~/services/Owner/historyPayment";
import "../ManageBooking/ManageBooking.scss";

function HistoryPayment() {
  const [listHitoryPayment, setListHistoryPayment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const token = localStorage.getItem("accessToken");
  const id = jwtDecode(token).id;

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllHistoryPayment();
  }, [currentPage]);

  const fetchAllHistoryPayment = async () => {
    const res = await historyPayment(id, currentPage, itemsPerPage);
    if (res.EC === 1) {
      setTotalPage(res.pagination.totalPages);
      setListHistoryPayment(res.DT);
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
        <h4>Lịch sử thanh toán</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ngày thanh toán</th>
            <th>Giờ thanh toán</th>
            <th>Nội dung thanh toán</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {listHitoryPayment.map((booking, index) => (
            <tr key={index}>
              <td>{booking.ngay_dat}</td>
              <td>{booking.gio_dat}</td>
              <td>{booking.description}</td>
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

export default HistoryPayment;
