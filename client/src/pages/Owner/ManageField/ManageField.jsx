import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";

import Table from "~/components/Table/Table";
import ModalCreateField from "./components/ModalCreateField/ModalCreateField";
import ModalUpdateField from "./components/ModalUpdateField/ModalUpdateField";
import ModalDeleteField from "./components/ModalDeleteField/ModalDeleteField";
import getAllFieldOwner from "~/services/Field/getAllFieldOwner";
import "./ManageField.scss";

function ManageField() {
  const [listFieldOwner, setListFieldOwner] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [personalData, setPersonalData] = useState({});

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const itemsPerPage = 3;

  // config titles in table
  const header = [
    { title: "Tên sân", key: "name" },
    { title: "Địa chỉ", key: "location" },
    { title: "Loại sân", key: "type" },
    { title: "Mô tả", key: "description" },
    { title: "" },
  ];

  useEffect(() => {
    fetchAllFieldOwner();
  }, [currentPage]);

  const fetchAllFieldOwner = async () => {
    const data = await getAllFieldOwner(currentPage, itemsPerPage);
    setListFieldOwner(data.results);
    setTotalPage(data.totalPages);
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
    <div className="manage-field-container">
      <button
        className="btn btn-primary btn-add"
        onClick={() => setShowModalAdd(true)}
      >
        <FcPlus />
        Thêm sân
      </button>
      <Table
        header={header}
        data={listFieldOwner}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
        handleClickBtnUpdate={handleClickBtnUpdate}
        handleClickBtnDelete={handleClickBtnDelete}
      />
      {/* Modal add */}
      <ModalCreateField
        showModalAdd={showModalAdd}
        setShowModalAdd={setShowModalAdd}
        fetchAllFieldOwner={fetchAllFieldOwner}
      />
      {/* Modal update*/}
      <ModalUpdateField
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        personalData={personalData}
        fetchAllFieldOwner={fetchAllFieldOwner}
      />
      {/* Modal delete */}
      <ModalDeleteField
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        personalData={personalData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchAllFieldOwner={fetchAllFieldOwner}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default ManageField;