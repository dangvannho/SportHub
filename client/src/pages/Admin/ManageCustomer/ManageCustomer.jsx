import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";

import Table from "~/components/Table/Table";
import ModalCreateUser from "./components/ModalCreateUser/ModalCreateUser";
import ModalUpdateUser from "./components/ModalUpdateUser/ModaleUpdateUser";
import ModalDeleteUser from "./components/ModalDeleteUser/ModalDeleteUser";
import getAllUser from "~/services/User/getAllUser";
import "./ManageCustomer.scss";

function ManageCustomer() {
  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [personalData, setPersonalData] = useState({});

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  // config titles in table
  const header = [
    { title: "Họ và tên", key: "name" },
    { title: "Email", key: "email" },
    { title: "Số điện thoại", key: "phone_number" },
    { title: "Thao tác" },
  ];

  useEffect(() => {
    fetchAllUser();
  }, [currentPage]);

  const fetchAllUser = async () => {
    setLoading(true);
    const data = await getAllUser(currentPage, itemsPerPage);
    setListUser(data.results);
    setTotalPage(data.totalPages);
    setLoading(false);
  };

  // handle click update in table
  const handleClickBtnUpdate = (dataUser) => {
    setPersonalData(dataUser);
    setShowModalUpdate(true);
  };

  // handle click delete in table
  const handleClickBtnDelete = (dataUser) => {
    setPersonalData(dataUser);
    setShowModalDelete(true);
  };

  return (
    <div className="manage-user-container">
      <h3>Thông tin khách hàng</h3>

      <button
        className="btn btn-primary btn-add"
        onClick={() => setShowModalAdd(true)}
      >
        <FcPlus />
        Thêm khách hàng
      </button>

      <Table
        header={header}
        addPriceBtn={false}
        data={listUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
        handleClickBtnUpdate={handleClickBtnUpdate}
        handleClickBtnDelete={handleClickBtnDelete}
        loading={loading}
      />

      {/* Modal add */}
      <ModalCreateUser
        showModalAdd={showModalAdd}
        setShowModalAdd={setShowModalAdd}
        fetchAllUser={fetchAllUser}
      />

      {/* Modal update*/}
      <ModalUpdateUser
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        personalData={personalData}
        fetchAllUser={fetchAllUser}
      />

      {/* Modal delete */}
      <ModalDeleteUser
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        personalData={personalData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchAllUser={fetchAllUser}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default ManageCustomer;
