import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import deleteUser from "~/services/User/deleteUser";
import getAllUser from "~/services/User/getAllUser";

function ModalDeleteCustomer({
  showModalDelete,
  setShowModalDelete,
  dataDelete,
  currentPage,
  setCurrentPage,
  fetchAllUser,
  itemsPerPage,
}) {
  const handleClose = () => setShowModalDelete(false);

  const handleSubmitDeleteUser = async () => {
    const res = await deleteUser(dataDelete._id);
    toast.success(res.message);
    handleClose();
    // Fetch lại danh sách người dùng
    const data = await getAllUser(currentPage, itemsPerPage);

    // Kiểm tra nếu không còn người dùng nào
    if (data.results.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1); // Giảm trang
    } else {
      // Nếu như còn người dùng thì gọi api của trang đó
      fetchAllUser();
    }
  };

  return (
    <>
      <Modal show={showModalDelete} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Xoá khách hàng?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có muốn xoá khách hàng có email:
          <strong> {dataDelete.email ? dataDelete.email : ""} ?</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmitDeleteUser();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteCustomer;
