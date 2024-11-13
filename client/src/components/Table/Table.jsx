import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";
import "./Table.scss";

function Table({
  header,
  addPriceBtn,
  manageCalendarBtn,
  data,
  currentPage,
  setCurrentPage,
  totalPage,
  handleClickBtnUpdate,
  handleClickBtnDelete,
  handleClickBtnAddTimePrice,
}) {
  const navigate = useNavigate();

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  return (
    <div className="wapper-table">
      <table className="table table-bordered table-striped table-hover ">
        <thead>
          <tr>
            {header.map((item, index) => {
              return (
                <th key={index} scope="col">
                  {item.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {header.map((cell, cellIndex) => {
                  if (cell.key) {
                    return <td key={cellIndex}>{row[cell.key]}</td>;
                  }
                  return null;
                })}
                <td className="group-btn">
                  {addPriceBtn && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        handleClickBtnAddTimePrice(row);
                      }}
                    >
                      Quản lí giờ và giá
                    </button>
                  )}
                  {manageCalendarBtn && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        navigate(
                          routeConfig.manageCalendar.replace(":id", row._id)
                        );
                      }}
                    >
                      Quản lí lịch
                    </button>
                  )}
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleClickBtnUpdate(row);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleClickBtnDelete(row);
                    }}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            );
          })}
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

export default Table;
