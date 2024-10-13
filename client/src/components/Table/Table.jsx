import ReactPaginate from "react-paginate";
import "./Table.scss";

function Table() {
  return (
    <div className="wapper-table">
      <table className="table table-bordered table-striped table-hover ">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>Abc@gmail.com</td>
            <td>User</td>
            <td className="group-btn">
              <button className="btn btn-secondary">View</button>
              <button className="btn btn-warning">Update</button>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>Abc@gmail.com</td>
            <td>User</td>
            <td className="group-btn">
              <button className="btn btn-secondary">View</button>
              <button className="btn btn-warning">Update</button>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>Abc@gmail.com</td>
            <td>User</td>
            <td className="group-btn">
              <button className="btn btn-secondary">View</button>
              <button className="btn btn-warning">Update</button>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>Abc@gmail.com</td>
            <td>User</td>
            <td className="group-btn">
              <button className="btn btn-secondary">View</button>
              <button className="btn btn-warning">Update</button>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>Abc@gmail.com</td>
            <td>User</td>
            <td className="group-btn">
              <button className="btn btn-secondary">View</button>
              <button className="btn btn-warning">Update</button>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

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
  );
}

export default Table;
