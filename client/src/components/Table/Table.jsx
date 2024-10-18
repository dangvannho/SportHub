import ReactPaginate from "react-paginate";
import "./Table.scss";

function Table({
  header,
  viewbtn,
  data,
  currentPage,
  setCurrentPage,
  totalPage,
  handleClickBtnUpdate,
  handleClickBtnDelete,
}) {
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
                  {viewbtn ?? (
                    <button className="btn btn-secondary">View</button>
                  )}
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleClickBtnUpdate(row);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleClickBtnDelete(row);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && <p>Danh sách người dùng rỗng</p>}

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
