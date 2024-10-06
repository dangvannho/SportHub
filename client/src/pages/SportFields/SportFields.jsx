import ReactPaginate from "react-paginate";
import FieldItem from "./components/FieldItem/FieldItem";
import StarIcon from "~/components/StarIcon/StarIcon";
import "./SportFields.scss";

function SportsField() {
  return (
    <div className="field-wrapper">
      <aside className="field-quantity">
        <h3 className="field-quantity__heading">Danh sách sân bãi</h3>
        <ul className="field-group__type">
          <li className="field-item__type">
            <span>Tất cả</span>
            <span>148</span>
          </li>
          <li className="field-item__type">
            <span>Bóng đá</span>
            <span>148</span>
          </li>
          <li className="field-item__type">
            <span>Tennis</span>
            <span>148</span>
          </li>
          <li className="field-item__type">
            <span>Cầu lông</span>
            <span>148</span>
          </li>
          <li className="field-item__type">
            <span>Bóng bàn</span>
            <span>148</span>
          </li>
          <li className="field-item__type">
            <span>Pickleball</span>
            <span>148</span>
          </li>
        </ul>
      </aside>

      <div className="field-content">
        <StarIcon />
        <h2 className="title">Danh sách sân bãi</h2>
        <span className="separator"></span>
        <div className="field-group">
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
          <FieldItem />
        </div>

        <ReactPaginate
          nextLabel="next >"
          onPageChange={() => {
            console.log(123);
          }}
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
        />
      </div>
    </div>
  );
}

export default SportsField;
