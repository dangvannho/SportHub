import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import FieldItem from "./components/FieldItem/FieldItem";
import StarIcon from "~/components/StarIcon/StarIcon";
import getAllField from "~/services/Field/getAllField";
import searchField from "~/services/Field/searchField";
import "./SportFields.scss";

function SportsField() {
  const { searchCriteria, setSearchCriteria } = useContext(AppContext);

  const [listField, setListField] = useState([]);
  const [quantityFieldAll, setQuantityFieldAll] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listTypeField, setListTypeField] = useState([]);

  const [selectedTypeField, setSelectedTypeField] = useState(
    searchCriteria.typeField
  );

  const [fieldName, setFieldName] = useState(searchCriteria.fieldName);
  const [fieldAddress, setFieldAddress] = useState(searchCriteria.fieldAddress);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchAllTypeField();

    if (selectedTypeField === "all" && (fieldName || fieldAddress)) {
      // Gọi API tìm kiếm nếu có giá trị trong input
      fetchSearchField(
        selectedTypeField,
        fieldName,
        fieldAddress,
        currentPage,
        itemsPerPage
      );
    } else if (selectedTypeField === "all") {
      // Gọi API lấy tất cả sân
      fetchAllField();
    } else {
      // Gọi API tìm kiếm dựa trên loại sân
      fetchSearchField(
        selectedTypeField,
        fieldName,
        fieldAddress,
        currentPage,
        itemsPerPage
      );
    }
  }, [currentPage]);

  // Api lấy tất cả các sân
  const fetchAllField = async () => {
    setLoading(true);
    const data = await getAllField(currentPage, itemsPerPage);
    setListField(data.paginatedFields.results);
    setQuantityFieldAll(data.paginatedFields.totalResults);
    setTotalPage(data.paginatedFields.totalPages);
    setLoading(false);
  };

  const fetchAllTypeField = async () => {
    const data = await getAllField(currentPage, itemsPerPage);
    setListTypeField(data.totalFieldsByType);
    setQuantityFieldAll(data.paginatedFields.totalResults);
  };

  // // Api lấy theo loại sân
  // const fetchTypeField = async () => {
  //   setLoading(true);
  //   const data = await getAllField(currentPage, itemsPerPage, typeField);
  //   setListField(data.paginatedFields.results);
  //   setTotalPage(data.paginatedFields.totalPages);
  //   setLoading(false);
  // };

  // api tìm kiếm
  const fetchSearchField = async (
    typeField,
    fieldName,
    fieldAddress,
    currentPage,
    itemsPerPage
  ) => {
    setLoading(true);
    const data = await searchField(
      typeField,
      fieldName,
      fieldAddress,
      currentPage,
      itemsPerPage
    );

    setListField(data.data.results);
    setTotalPage(data.data.totalPages);
    setLoading(false);
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    console.log(`User requested page number ${event.selected}`);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setSearchCriteria({
      ...searchCriteria,
      typeField: selectedTypeField,
      fieldName,
      fieldAddress,
    });

    fetchSearchField(
      selectedTypeField,
      fieldName,
      fieldAddress,
      1,
      itemsPerPage
    );
  };

  return (
    <div className="field-wrapper">
      <aside className="field-quantity">
        <h3 className="field-quantity__heading">Danh sách sân bãi</h3>
        <ul className="field-group__type">
          <li
            className={`field-item__type ${
              searchCriteria.typeField === "all" ? "active" : ""
            }`}
          >
            <span>Tất cả</span>
            <span>{quantityFieldAll}</span>
          </li>
          {listTypeField.map((item, index) => {
            return (
              <li
                className={`field-item__type ${
                  searchCriteria.typeField === item._id ? "active" : ""
                }`}
                key={index}
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

        <div className="search-field">
          <div className="search-box">
            <select
              className="field-type-select"
              value={selectedTypeField}
              onChange={(e) => setSelectedTypeField(e.target.value)}
            >
              <option value="all">Tất cả các sân</option>
              {listTypeField.map((item, index) => (
                <option key={index} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nhập tên sân..."
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="field-name-input"
            />

            <input
              type="text"
              placeholder="Nhập khu vực..."
              value={fieldAddress}
              onChange={(e) => setFieldAddress(e.target.value)}
              className="address-input"
            />

            <button className="search-button" onClick={handleSearch}>
              <IoIosSearch size={20} color="white" />
            </button>
          </div>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="field-group">
            {listField.map((item, index) => {
              return <FieldItem data={item} key={index} />;
            })}
            {listField.length === 0 && <p>{"Danh sách sân rỗng"}</p>}
          </div>
        )}

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
