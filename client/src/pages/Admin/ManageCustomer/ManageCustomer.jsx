import { useState, useEffect } from "react";
import Table from "~/components/Table/Table";
import ModalDeleteCustomer from "./components/ModalDeleteCustomer/ModalDeleteCustomer";
import getAllUser from "~/services/User/getAllUser";
import "./ManageCustomer.scss";

function ManageCustomer() {
  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  // delete user
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState({});

  const itemsPerPage = 3;

  // config titles in table
  const header = [
    { title: "Username", key: "name" },
    { title: "Email", key: "email" },
    { title: "Phone number", key: "phone_number" },
    { title: "Status", key: "account_status" },
    { title: "Action" },
  ];

  useEffect(() => {
    fetchAllUser();
  }, [currentPage]);

  const fetchAllUser = async () => {
    const data = await getAllUser(currentPage, itemsPerPage);
    setListUser(data.results);
    setTotalPage(data.totalPages);
  };

  // handle click delete in table
  const handleClickBtnDelete = (dataUser) => {
    setDataDelete(dataUser);
    setShowModalDelete(true);
  };

  return (
    <div className="manage-user-container">
      <h3>Thông tin khách hàng</h3>
      <Table
        header={header}
        data={listUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
        handleClickBtnDelete={handleClickBtnDelete}
      />

      <ModalDeleteCustomer
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        dataDelete={dataDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchAllUser={fetchAllUser}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default ManageCustomer;
