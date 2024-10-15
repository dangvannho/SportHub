import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import FieldItem from "./components/FieldItem/FieldItem";
import StarIcon from "~/components/StarIcon/StarIcon";
import getAllField from "~/services/Field/getAllFied";
import "./SportFields.scss";

function SportsField() {
  const [listField, setListField] = useState([]);
  const [quantityFieldAll, setQuantityFieldAll] = useState(0);
  const [typeField, setTypeField] = useState("Tất cả");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listTypeField, setListTypeField] = useState([]);

  const itemsPerPage = 9;

  useEffect(() => {
    if (typeField === "Tất cả") {
      fetchAllField();
    } else {
      fetchTypeField();
    }
  }, [currentPage, typeField]);

  // Api lấy tất cả các sân
  const fetchAllField = async () => {
    const data = await getAllField(currentPage, itemsPerPage);
    setListField(data.paginatedFields.results);
    setQuantityFieldAll(data.paginatedFields.totalResults);
    setTotalPage(data.paginatedFields.totalPages);
    setListTypeField(data.totalFieldsByType);
  };

  // Api lấy theo loại sân
  const fetchTypeField = async () => {
    const data = await getAllField(currentPage, itemsPerPage, typeField);
    setListField(data.paginatedFields.results);
    setTotalPage(data.paginatedFields.totalPages);
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  return (
    <div className="field-wrapper">
      <aside className="field-quantity">
        <h3 className="field-quantity__heading">Danh sách sân bãi</h3>
        <ul className="field-group__type">
          <li
            className={`field-item__type ${
              typeField === "Tất cả" ? "active" : ""
            }`}
            onClick={() => {
              setTypeField("Tất cả");
              setCurrentPage(1);
            }}
          >
            <span>Tất cả</span>
            <span>{quantityFieldAll}</span>
          </li>
          {listTypeField.map((item, index) => {
            return (
              <li
                className={`field-item__type ${
                  typeField === item._id ? "active" : ""
                }`}
                key={index}
                onClick={() => {
                  setTypeField(item._id);
                  setCurrentPage(1);
                }}
              >
                <span>{item._id}</span>
                <span>{item.total}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="field-content">
        <StarIcon />
        <h2 className="title">Danh sách sân bãi</h2>
        <span className="separator"></span>
        <div className="field-group">
          {listField.map((item, index) => {
            return <FieldItem data={item} key={index} />;
          })}
          {listField.length === 0 && <p>{"Danh sách sân rỗng"}</p>}
        </div>

        {/* Phân trang */}
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
    </div>
  );
}

export default SportsField;
