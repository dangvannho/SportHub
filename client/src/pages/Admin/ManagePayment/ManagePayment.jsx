import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import getBill from "~/services/Admin/getBill";
import "~/pages/Owner/ManageBooking/ManageBooking.scss";
import "./ManagePayment.scss";

function ManagePayment() {
  const [listBill, setLisBill] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllBill();
  }, [currentPage]);

  const fetchAllBill = async () => {
    const res = await getBill(currentPage, itemsPerPage);
    if (res.EC === 1) {
      setTotalPage(res.pagination.totalPages);
      setLisBill(res.DT);
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
        <h4>Danh sách thanh toán</h4>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên chủ sân</th>
            <th>Ngày thanh toán</th>
            <th>Giờ thanh toán</th>
            <th>Nội dung thanh toán</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {listBill.map((booking, index) => (
            <tr key={index}>
              <td>
                <p className="field_name">{booking.name}</p>
              </td>
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

export default ManagePayment;
