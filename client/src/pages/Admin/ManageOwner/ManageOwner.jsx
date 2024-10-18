import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";

import Table from "~/components/Table/Table";
import ModalCreateOwner from "./components/ModalCreateOwner/ModalCreateOwner";
import ModalUpdateOwner from "./components/ModalUpdateOwner/ModaleUpdateOwner";
import ModalDeleteOwner from "./components/ModalDeleteOwner/ModalDeleteOwner";
import getAllOnwer from "~/services/Owner/getAllOwner";
import "./ManageOwner.scss";

function ManageOwner() {
  const [listOwner, setListOwner] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [personalData, setPersonalData] = useState({});

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const itemsPerPage = 3;

  // config titles in table
  const header = [
    { title: "Business name", key: "business_name" },
    { title: "Email", key: "email" },
    { title: "Phone number", key: "phone_number" },
    { title: "Address", key: "address" },
    { title: "Action" },
  ];

  useEffect(() => {
    fetchAllOwner();
  }, [currentPage]);

  const fetchAllOwner = async () => {
    const data = await getAllOnwer(currentPage, itemsPerPage);
    setListOwner(data.results);
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
    <div className="manage-user-container">
      <h3>Thông tin chủ sân</h3>

      <button
        className="btn btn-primary btn-add"
        onClick={() => setShowModalAdd(true)}
      >
        <FcPlus />
        Thêm chủ sân
      </button>

      <Table
        header={header}
        viewbtn={false}
        data={listOwner}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
        handleClickBtnUpdate={handleClickBtnUpdate}
        handleClickBtnDelete={handleClickBtnDelete}
      />

      {/* Modal add */}
      <ModalCreateOwner
        showModalAdd={showModalAdd}
        setShowModalAdd={setShowModalAdd}
        fetchAllOwner={fetchAllOwner}
      />

      {/* Modal update*/}
      <ModalUpdateOwner
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        personalData={personalData}
        fetchAllOwner={fetchAllOwner}
      />

      {/* Modal delete */}
      <ModalDeleteOwner
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        personalData={personalData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchAllOwner={fetchAllOwner}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default ManageOwner;
